function toastBuilder(options) {

	function toastOff() {

		toastTarget.removeChild(div);
	}

	var opts = options || {};

	opts.defaultText = opts.defaultText || 'default text';
	opts.displayTime = opts.displayTime || 3000;
	opts.type = opts.type || 'info';
	console.log(opts.defaultText);
	var toastTarget = document.getElementById('toastTarget');
	var div = document.createElement('div');
	div.style.opacity = 1;
	div.className = 'toast toast_'+opts.type;
	toastTarget.appendChild(div);
	div.innerHTML = opts.defaultText;
	setTimeout(function() {
		toastOff();
	}, opts.displayTime);

}
