(function (root) {
    "use strict";
    var cg = root.CastleGame = root.CastleGame || {};
    var Toast = cg.Toast = {};
    var region;
    Toast.init = function () { region = document.getElementById("toast-region"); };
    Toast.show = function (message, kind) {
        if (!region) Toast.init();
        var item = document.createElement("div"); item.className = "toast toast--" + (kind || "info"); item.innerHTML = "<span class=\"toast__icon\" aria-hidden=\"true\">✦</span><span></span>"; item.querySelector("span:last-child").textContent = message; region.appendChild(item); setTimeout(function () { item.style.opacity = "0"; item.style.transform = "translateY(8px)"; setTimeout(function () { if (item.parentNode) item.parentNode.removeChild(item); }, 220); }, 2800);
    };
}(window));
