[CmdletBinding()]
param(
  [string]$ProjectRoot,
  [switch]$SkipBrowser,
  [ValidateRange(1000, 120000)]
  [int]$TestBudgetMs = 20000,
  [ValidateRange(1000, 120000)]
  [int]$AppBudgetMs = 5000
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

function Resolve-CloudboundRoot {
  param([string]$RequestedRoot)

  if ($RequestedRoot) {
    return (Resolve-Path -LiteralPath $RequestedRoot).Path
  }

  $candidate = [IO.Path]::GetFullPath(
    (Join-Path $PSScriptRoot "..\..\..\..")
  )
  if (-not (Test-Path -LiteralPath $candidate -PathType Container)) {
    throw "Could not resolve the Cloudbound project root from $PSScriptRoot"
  }
  return $candidate
}

function Find-Edge {
  $candidates = @()
  $command = Get-Command msedge.exe -ErrorAction SilentlyContinue
  if ($command) { $candidates += $command.Source }
  if (${env:ProgramFiles(x86)}) {
    $candidates += "${env:ProgramFiles(x86)}\Microsoft\Edge\Application\msedge.exe"
  }
  if ($env:ProgramFiles) {
    $candidates += "$env:ProgramFiles\Microsoft\Edge\Application\msedge.exe"
  }
  if ($env:LOCALAPPDATA) {
    $candidates += "$env:LOCALAPPDATA\Microsoft\Edge\Application\msedge.exe"
  }
  return @($candidates | Where-Object { $_ -and (Test-Path -LiteralPath $_) }) |
    Select-Object -First 1
}

function Invoke-EdgeDump {
  param(
    [string]$EdgePath,
    [string]$PagePath,
    [int]$BudgetMs
  )

  $tempRoot = [IO.Path]::GetFullPath([IO.Path]::GetTempPath()).TrimEnd("\")
  $leaf = "cloudbound-edge-$PID-$([Guid]::NewGuid().ToString('N'))"
  $profile = Join-Path $tempRoot $leaf
  New-Item -ItemType Directory -Path $profile | Out-Null

  try {
    $resolvedPage = (Resolve-Path -LiteralPath $PagePath).Path
    $uri = [Uri]::new($resolvedPage).AbsoluteUri
    $arguments = @(
      "--headless=new",
      "--disable-gpu",
      "--no-first-run",
      "--user-data-dir=$profile",
      "--virtual-time-budget=$BudgetMs",
      "--dump-dom",
      $uri
    )
    # Windows PowerShell converts native stderr into error records. Edge may
    # emit harmless sync/network diagnostics even when the DOM dump succeeds,
    # so suppress those records without weakening the script's normal strictness.
    $previousErrorAction = $ErrorActionPreference
    try {
      $ErrorActionPreference = "Continue"
      $dom = & $EdgePath @arguments 2>$null | Out-String
      $edgeExitCode = $LASTEXITCODE
    }
    finally {
      $ErrorActionPreference = $previousErrorAction
    }
    if ($edgeExitCode -ne 0) {
      throw "Edge exited with code $edgeExitCode while opening $PagePath"
    }
    return $dom
  }
  finally {
    if (Test-Path -LiteralPath $profile) {
      $resolvedProfile = (Resolve-Path -LiteralPath $profile).Path
      $safeRoot = $resolvedProfile.StartsWith(
        $tempRoot,
        [StringComparison]::OrdinalIgnoreCase
      )
      $safeLeaf = (Split-Path -Leaf $resolvedProfile).StartsWith(
        "cloudbound-edge-",
        [StringComparison]::Ordinal
      )
      if (-not ($safeRoot -and $safeLeaf)) {
        throw "Refusing to remove unexpected Edge profile: $resolvedProfile"
      }
      Remove-Item -LiteralPath $resolvedProfile -Recurse -Force
    }
  }
}

function Read-DomCount {
  param([string]$Dom, [string]$Id)
  $match = [regex]::Match(
    $Dom,
    "<strong id=`"$([regex]::Escape($Id))`">(\d+)</strong>"
  )
  if (-not $match.Success) { return -1 }
  return [int]$match.Groups[1].Value
}

$root = Resolve-CloudboundRoot $ProjectRoot
$required = @("index.html", "js", "css", "tests\test-runner.html")
foreach ($relative in $required) {
  if (-not (Test-Path -LiteralPath (Join-Path $root $relative))) {
    throw "Not a Cloudbound project root; missing $relative in $root"
  }
}

Push-Location $root
try {
  $rg = Get-Command rg -ErrorAction SilentlyContinue
  $node = Get-Command node -ErrorAction SilentlyContinue
  if (-not $rg) { throw "ripgrep (rg) is required for JavaScript discovery" }
  if (-not $node) { throw "Node.js is required for JavaScript syntax checks" }

  $files = @(& $rg.Source --files js tests -g "*.js")
  if ($LASTEXITCODE -ne 0 -or $files.Count -eq 0) {
    throw "Could not discover JavaScript files"
  }
  $syntaxFailures = @()
  foreach ($file in $files) {
    $output = & $node.Source --check $file 2>&1 | Out-String
    if ($LASTEXITCODE -ne 0) {
      $syntaxFailures += "$file`n$output"
    }
  }
  if ($syntaxFailures.Count -gt 0) {
    throw "JavaScript syntax failures:`n$($syntaxFailures -join "`n")"
  }
  Write-Host "[OK] JavaScript syntax: $($files.Count) files"

  $git = Get-Command git -ErrorAction SilentlyContinue
  if ($git) {
    & $git.Source diff --check
    if ($LASTEXITCODE -ne 0) { throw "git diff --check failed" }
    Write-Host "[OK] git diff --check"
  }
  else {
    Write-Warning "git was not found; diff validation was skipped"
  }

  if ($SkipBrowser) {
    Write-Warning "Browser verification skipped by request"
    return
  }

  $edge = Find-Edge
  if (-not $edge) {
    throw "Microsoft Edge was not found. Use -SkipBrowser only if browser validation is unavailable."
  }

  $testDom = Invoke-EdgeDump $edge "tests\test-runner.html" $TestBudgetMs
  $total = Read-DomCount $testDom "total-count"
  $passed = Read-DomCount $testDom "pass-count"
  $failed = Read-DomCount $testDom "fail-count"
  if ($total -le 0 -or $passed -ne $total -or $failed -ne 0) {
    $errors = [regex]::Matches(
      $testDom,
      '<pre class="test-error">(.*?)</pre>',
      [Text.RegularExpressions.RegexOptions]::Singleline
    ) | ForEach-Object {
      [Net.WebUtility]::HtmlDecode(
        ($_.Groups[1].Value -replace '<[^>]+>', ' ' -replace '\s+', ' ').Trim()
      )
    }
    throw "Browser tests failed: total=$total passed=$passed failed=$failed`n$($errors -join "`n")"
  }
  Write-Host "[OK] Edge file:// browser tests: $passed/$total"

  $appDom = Invoke-EdgeDump $edge "index.html" $AppBudgetMs
  $homeActive = [regex]::IsMatch(
    $appDom,
    '<section(?=[^>]+id="home-page")(?=[^>]+class="[^"]*\bis-active\b[^"]*")[^>]*>',
    [Text.RegularExpressions.RegexOptions]::IgnoreCase
  )
  $versionSource = Get-Content -LiteralPath "js\core\namespace.js" -Raw
  $expectedVersion = [regex]::Match(
    $versionSource,
    'DJGame\.version\s*=\s*"([^"]+)"'
  ).Groups[1].Value
  $versionMatch = [regex]::Match(
    $appDom,
    '<[^>]+id="app-version"[^>]*>(.*?)</[^>]+>',
    [Text.RegularExpressions.RegexOptions]::Singleline
  )
  $actualVersion = [Net.WebUtility]::HtmlDecode(
    ($versionMatch.Groups[1].Value -replace '<[^>]+>', '').Trim()
  )
  $errorMarkers = [regex]::Matches(
    $appDom,
    '(Unhandled|ReferenceError|TypeError|SyntaxError)'
  ).Count
  if (
    -not $homeActive -or
    -not $expectedVersion -or
    $actualVersion -ne $expectedVersion -or
    $errorMarkers -ne 0
  ) {
    throw "Production startup failed: home=$homeActive expectedVersion=$expectedVersion actualVersion=$actualVersion errors=$errorMarkers"
  }
  Write-Host "[OK] Production startup: home active, version $actualVersion"
}
finally {
  Pop-Location
}
