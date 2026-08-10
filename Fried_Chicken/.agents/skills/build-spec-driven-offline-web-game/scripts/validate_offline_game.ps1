[CmdletBinding()]
param(
    [Parameter(Position = 0)]
    [string]$ProjectRoot = ".",

    [switch]$SkipTests
)

$ErrorActionPreference = "Stop"
$failures = [System.Collections.Generic.List[string]]::new()
$warnings = [System.Collections.Generic.List[string]]::new()

function Add-Failure {
    param([string]$Message)
    $script:failures.Add($Message)
}

function Add-Warning {
    param([string]$Message)
    $script:warnings.Add($Message)
}

function Get-ReferenceValue {
    param([System.Text.RegularExpressions.Match]$Match)

    foreach ($groupName in @("double", "single", "bare")) {
        if ($Match.Groups[$groupName].Success) {
            return $Match.Groups[$groupName].Value.Trim()
        }
    }

    return ""
}

function Test-LocalReference {
    param(
        [string]$Reference,
        [string]$OwnerPath,
        [string]$RootPath
    )

    if ([string]::IsNullOrWhiteSpace($Reference) -or $Reference.StartsWith("#")) {
        return
    }

    if ($Reference -match "^(?i)(https?:)?//") {
        Add-Failure "Remote runtime reference in '$OwnerPath': $Reference"
        return
    }

    if ($Reference -match "^(?i)(data|mailto|tel|javascript):") {
        return
    }

    if ($Reference -match "^(?i)file:") {
        Add-Failure "Hard-coded file URL in '$OwnerPath': $Reference"
        return
    }

    $pathOnly = ($Reference -split "[#?]", 2)[0]
    if ([string]::IsNullOrWhiteSpace($pathOnly)) {
        return
    }

    try {
        $decodedPath = [System.Uri]::UnescapeDataString($pathOnly).Replace("/", [System.IO.Path]::DirectorySeparatorChar)
    }
    catch {
        Add-Failure "Invalid URL encoding in '$OwnerPath': $Reference"
        return
    }

    if ($decodedPath.StartsWith([System.IO.Path]::DirectorySeparatorChar)) {
        $candidate = Join-Path $RootPath $decodedPath.TrimStart([System.IO.Path]::DirectorySeparatorChar)
    }
    else {
        $candidate = Join-Path (Split-Path -Parent $OwnerPath) $decodedPath
    }

    if (-not (Test-Path -LiteralPath $candidate -PathType Leaf)) {
        Add-Failure "Missing local reference in '$OwnerPath': $Reference"
    }
}

try {
    $resolvedRoot = (Resolve-Path -LiteralPath $ProjectRoot).Path
}
catch {
    Write-Error "Project root does not exist: $ProjectRoot"
    exit 1
}

if (-not (Test-Path -LiteralPath $resolvedRoot -PathType Container)) {
    Write-Error "Project root is not a directory: $resolvedRoot"
    exit 1
}

$indexPath = Join-Path $resolvedRoot "index.html"
if (-not (Test-Path -LiteralPath $indexPath -PathType Leaf)) {
    Add-Failure "Missing required entry point: index.html"
}

$sourceFiles = @(
    Get-ChildItem -LiteralPath $resolvedRoot -Recurse -File |
        Where-Object {
            $_.FullName -notmatch "[\\/](\.git|node_modules)[\\/]" -and
            $_.Extension -in @(".html", ".css", ".js")
        }
)

$htmlReferencePattern = '(?is)\b(?:src|href)\s*=\s*(?:"(?<double>[^"]*)"|''(?<single>[^'']*)'')'
$cssReferencePattern = '(?is)url\(\s*(?:"(?<double>[^"]*)"|''(?<single>[^'']*)''|(?<bare>[^)\s]+))\s*\)'

foreach ($file in $sourceFiles) {
    $content = [System.IO.File]::ReadAllText($file.FullName, [System.Text.Encoding]::UTF8)

    if ($file.Extension -eq ".html") {
        if ($content -match '(?is)<script\b[^>]*\btype\s*=\s*["'']module["'']') {
            Add-Failure "ES module script is incompatible with the zero-build file:// contract: $($file.FullName)"
        }

        foreach ($match in [System.Text.RegularExpressions.Regex]::Matches($content, $htmlReferencePattern)) {
            Test-LocalReference -Reference (Get-ReferenceValue $match) -OwnerPath $file.FullName -RootPath $resolvedRoot
        }
    }

    if ($file.Extension -eq ".css") {
        foreach ($match in [System.Text.RegularExpressions.Regex]::Matches($content, $cssReferencePattern)) {
            Test-LocalReference -Reference (Get-ReferenceValue $match) -OwnerPath $file.FullName -RootPath $resolvedRoot
        }
    }

    if ($content -match '(?i)\bfetch\s*\(') {
        Add-Failure "Runtime fetch() found in offline source: $($file.FullName)"
    }
}

$node = Get-Command node -ErrorAction SilentlyContinue
$javaScriptFiles = @($sourceFiles | Where-Object { $_.Extension -eq ".js" })

if ($null -eq $node) {
    Add-Warning "Node.js is unavailable; skipped JavaScript syntax checks and tests."
}
else {
    foreach ($file in $javaScriptFiles) {
        $syntaxOutput = & $node.Source --check $file.FullName 2>&1 | Out-String
        if ($LASTEXITCODE -ne 0) {
            Add-Failure "JavaScript syntax check failed for '$($file.FullName)': $($syntaxOutput.Trim())"
        }
    }

    if (-not $SkipTests) {
        $testFiles = @(
            Get-ChildItem -LiteralPath $resolvedRoot -Recurse -File -Filter "*.test.js" |
                Where-Object { $_.FullName -notmatch "[\\/](\.git|node_modules)[\\/]" }
        )

        if ($testFiles.Count -eq 0) {
            Add-Warning "No *.test.js files found; skipped Node tests."
        }
        else {
            $testPaths = @($testFiles | ForEach-Object { $_.FullName })
            $testOutput = & $node.Source --test @testPaths 2>&1 | Out-String
            if ($LASTEXITCODE -ne 0) {
                Add-Failure "Node test suite failed:`n$($testOutput.Trim())"
            }
            else {
                Write-Host $testOutput.Trim()
            }
        }
    }
}

if (Test-Path -LiteralPath (Join-Path $resolvedRoot "package.json") -PathType Leaf) {
    Add-Warning "package.json exists. Confirm it is optional and not required for file:// gameplay."
}

foreach ($warning in $warnings) {
    Write-Warning $warning
}

if ($failures.Count -gt 0) {
    Write-Host ""
    Write-Host "Offline game validation failed with $($failures.Count) issue(s):" -ForegroundColor Red
    foreach ($failure in $failures) {
        Write-Host "- $failure" -ForegroundColor Red
    }
    exit 1
}

Write-Host ""
Write-Host "Offline game validation passed." -ForegroundColor Green
Write-Host "Checked $($sourceFiles.Count) HTML/CSS/JavaScript file(s) and $($javaScriptFiles.Count) JavaScript syntax target(s)."
if ($SkipTests) {
    Write-Host "Node tests were skipped by request."
}
exit 0
