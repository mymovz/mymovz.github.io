(function () {
	var canClip = !!(navigator.clipboard && window.isSecureContext);
	var canExec = false;
	try {
		canExec = !!(document.queryCommandSupported && document.queryCommandSupported("copy"));
	} catch (e) {}
	if (!canClip && !canExec) return;

	var buttons = document.querySelectorAll("[data-copy]");
	for (var i = 0; i < buttons.length; i++) {
		buttons[i].removeAttribute("hidden");
		buttons[i].addEventListener("click", onClick);
	}

	function onClick() {
		var btn = this;
		var link = document.getElementById(btn.getAttribute("data-copy"));
		if (!link || btn.getAttribute("data-busy")) return;
		var url = link.href;
		if (canClip) {
			navigator.clipboard.writeText(url).then(
				function () { flash(btn, true); },
				function () { flash(btn, legacyCopy(url)); }
			);
		} else {
			flash(btn, legacyCopy(url));
		}
	}

	function legacyCopy(text) {
		var ta = document.createElement("textarea");
		ta.value = text;
		ta.setAttribute("readonly", "");
		ta.style.position = "fixed";
		ta.style.top = "-9999px";
		document.body.appendChild(ta);
		ta.select();
		var ok = false;
		try {
			ok = document.execCommand("copy");
		} catch (e) {}
		document.body.removeChild(ta);
		return ok;
	}

	function flash(btn, ok) {
		var label = btn.getElementsByTagName("span")[0];
		var text = label.textContent;
		btn.setAttribute("data-busy", "1");
		btn.className += ok ? " is-ok" : " is-err";
		label.textContent = ok ? "لینک کپی شد" : "کپی نشد";
		setTimeout(function () {
			label.textContent = text;
			btn.className = btn.className.replace(/ is-(ok|err)/g, "");
			btn.removeAttribute("data-busy");
		}, 2000);
	}
})();
