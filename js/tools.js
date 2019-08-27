
(function() {
	// function to add a javascript file to page
	function addScript(url) {
		var element = document.createElement('script');
		element.type ="text/javascript";
		element.src = url;

		addFile(element);
	}

	// function to add a css file to page
	function addStyle(url) {
		var element = document.createElement('link');
		element.type = "text/css";
		element.rel = "stylesheet";
		element.href = url;

		addFile(element);
	}

	function addFile(element) {
		var title = document.getElementsByTagName('head')[0];
		document.head.appendChild(element);
	}


	var jQueryRequired = 1;
	function addResources () {
		//check if jQuery is loaded
		if (typeof jQuery=='undefined') {
			if (jQueryRequired == 1) {
				jqueryRequired = 100;
				addScript('//code.jquery.com/jquery-1.12.4.min.js');
			}

			setTimeout(addResources, 1000);
		}
		else{
			addStyle('https://wilsonhuynh.github.io/css/common.css');
			addScript('//cdnjs.cloudflare.com/ajax/libs/Base64/0.3.0/base64.js');
			addScript('https://wilsonhuynh.github.io/js/common.js?v=0.2');
		}
	}

	addResources();
})();