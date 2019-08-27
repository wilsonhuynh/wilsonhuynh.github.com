var wh = {};

// initialisze
window.setTimeout(function(){
	$('body').on("click", "log", function(){
		// var base64Data = btoa("[" + $(this).text() + "]");
		// url = "data:application/json;base64," + base64Data
		
		// window.open(url);		
		
		console.log(eval("[" + $(this).text() + "]"));
	});

	// add checkbox to toggle selections on the Octopus deployment page
	wh.selectAllForOctopusPage();	
}, 1000);


// add shortcut handlers
window.onkeyup = function(e) {
    if (e.altKey)  {	
		switch(e.keyCode) {
			case 48: // ALT 0 - toggle help menu
				wh.toggleToolbar();
				break;
				
			case 49: // ALT 1 - remove all javascript handlers on the page
				wh.removeAllEventHandlers();
				break;
				
			case 50: // ALT 2 - take a snapshot of current page
				wh.snapshot();
				break;
				
			case 51: // ALT 3 - toggle print preview
				wh.visualPrint();
				break;
				
			case 52: // ALT 4 - show javascript handlers on the current page
				wh.visualEvent();
				break;
			
			case 53: // ALT 5 - angular - send text to console log
				wh.visualLog();
				break;
				
			case 54: 
			case 82: // ALT 6 or ALT r - reload stylesheets
				wh.reloadStylesheets();
				break;
				
			case 55: // ALT 7 - auto form fill
				wh.formFill();
				break;
				
			case 56: // ALT 8 - clear Webjet page timeout form fill
				wh.clearWebjetPageTimeout();				
				break;
				
			case 57: // ALT 9 - show responsive grid guide
				wh.gridGuide();				
				break;
			
		}
    }
}


//-- remove all javascript events handlers --//
wh.removeAllEventHandlers = function(){	
	$(document).off().find("*").off();	
}

//-- copy current page content in new tab --//
wh.snapshot = function() {
	// clone page content and remove all js refs
	var content = $("html").clone();
	content.find("script").remove();
  
	// add jquery if needed for bookmarklet
	//var jqueryScript = document.createElement('script');
	//jqueryScript.type ="text/javascript";
	//jqueryScript.src = "//ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js";
	//content.find("body").append(jqueryScript);	
  
	var snapshot = window.open();  
	snapshot.document.write("<!DOCTYPE html><html>" + content.html() + "</html>");
	snapshot.document.close();	
}

//-- toggle print preview by switching css media  --//
wh.visualPrint = function() {
    $('link').each(function(){
        if (this.media === 'print') {
            this.media = 'screen';
        } else {
            this.media = 'print';
        }
    })
};

// visual event
wh.visualEvent = function(){	
  if (typeof VisualEvent != 'undefined')
  {
    if (VisualEvent.instance !== null) {
      VisualEvent.close();
    } 
    else {
      new VisualEvent();
    }
  } 
  else {
	  wh.addScript('//local.webjet.com.au/code/VisualEvent/VisualEvent_Loader.js');
  }
};

//-- send text to console log which can be used in log data in angularJs application --//
//-- use HTML markup: <log>{{ angular-object }}<log>
wh.visualLog = function() {
	var scopes = []
	$('log').each(function() {
	  scopes.push(eval("(" + $(this).text() + ")"));
	})
	
	if (scopes.length) {
		console.log(scopes);
	}
	else {
		// show usage syntax
		alert('usage: <log>{{ angular-object }}<log>')
	}	
};

// reload style sheet files
wh.reloadStylesheets = function () {
	var randomString = '?q=' + new Date().getTime();
	
	// reload style that not googleapi
	$('link[rel="stylesheet"]').not('[href*="googleapi"]').each(function () {
		var position = $(this).prev();
		var newStyle = $(this).clone();
		newStyle[0].href = this.href.replace(/\?.*|$/, randomString);
	
		$(this).remove();
		$(newStyle).insertAfter(position);		
	});
};
 
// function to add a javascript file to page
wh.addScript = function(url) {
	var element = document.createElement('script');
	element.type ="text/javascript";
	element.src = url;
	
	document.head.appendChild(element);
}

// tool menu bar
wh.toggleToolbar = function() {
	var toolbar = $("#custom-toolbar");
	
	if (toolbar.length < 1) {
		toolbar = $("<ul>").attr("id", "custom-toolbar");
		toolbar.append("<li>1. <a href='#' data-fn='wh.removeAllEventHandlers'>Remove Event Handlers</a>");	
		toolbar.append("<li>2. <a href='#' data-fn='wh.snapshot'>Page Snapshot</a>");	
		toolbar.append("<li>3. <a href='#' data-fn='wh.visualPrint'>Print Preview</a>");	
		toolbar.append("<li>4. <a href='#' data-fn='wh.visualEvent'>Visual Event</a>");	
		toolbar.append("<li>5. <a href='#' data-fn='wh.visualLog'>Visual Log</a>");			
		toolbar.append("<li>6. <a href='#' data-fn='wh.reloadStylesheets'>Reload Stylesheet</a> (R)");			
		toolbar.append("<li>7. <a href='#' data-fn='wh.formFill'>Form Fill</a>");			
		toolbar.append("<li>8. <a href='#' data-fn='wh.clearWebjetPageTimeout'>Clear Webjet Page Timeout</a>");
		toolbar.append("<li>9. <a href='#' data-fn='wh.gridGuide'>Responsive Grid Guide</a>");			
		$('body').append(toolbar);
		
		// render bookmarklet
		toolbar.find("a").each(function() {			
			var fnName = $(this).data('fn');				
			var fnString = eval(fnName).toString();
			
			if (fnString) {
				var a = fnString.split('\n');
				for ( var i=0, iLen=a.length ; i<iLen ; i++ ) {
					a[i] = $.trim(a[i]);
					if ( a[i].indexOf('//') === 0 ) {
						a[i] = "";
					}
				}
				fnString = a.join('');
				//fnString.replace(' ', '%20');
				
				this.href = "javascript:(" + fnString + ")();";				
			}
		});
	}	
	
	toolbar.toggle();
}

//	add checkbox to toggle selections on the Octopus deployment page
wh.selectAllForOctopusPage = function() {
	var isOctopusUrl = window.location.href.indexOf("wjmel-octo001/app") > 0;		
	if (isOctopusUrl) {		
		// toggle selection between Latest/Last radio buttons
		var container = $("#body");		
		container.on("click", "form[name=releaseCreateForm] th", function(){					
			var state = container.data("state") ? true : false;
			var newState = !state;
			container.data("state", newState);
		
			container.find("tbody td:nth-child(3) input").prop("checked", state);
			container.find("tbody td:nth-child(4) input").prop("checked", newState);  
		})
	}	
}


// form fill
wh.formFill = function() {
	// activetime time sheet
	$("#taskRow8 input.text.inputTT:visible:lt(5)").val("0:30");
	$("#taskRow4 input.text.inputTT:visible:lt(5)").val("7:30");
	
	$("#SubmitTTButton").click();
}

// clear page timeout or BPG timer
wh.setWebjetPageTimeout = function(timer) {
	sessionTimeout = timer;
	$("#price-held-expires").val(sessionTimeout);	
}

// clear page timeout or BPG timer
wh.clearWebjetPageTimeout = function() {
	wh.setWebjetPageTimeout(1500000000000);
}

// simulate session timeout
wh.getWebjetPageTimeout = function() {
	wh.setWebjetPageTimeout(0);
}

// Responsive Grid Guide
wh.gridGuide = function() {	
	var style = $("<style>#grid-guide{width:980px;z-index:2000;position:absolute;padding-right:10px;top:20%;color:yellow;font-size:16px;text-align:center;cursor:move;min-width:400px}#grid-guide .ui-resizable-handle{z-index:2001 !important}#grid-guide .ui-resizable-e{margin-right:6px;width:24px}#grid-guide .ui-resizable-s{margin-bottom:6px;height:24px}#grid-guide .ui-resizable-se{width:20px;height:20px}#grid-guide .ui-resizable-se:after{content:'\00ab';display:inline-block}#grid-guide-layout{width:100%;position:absolute;left:0;z-index:1000;height:100%;opacity:.7}#grid-guide-layout div{box-sizing:border-box;display:block;float:left;width:8.3333%;background:#fb6a6a;height:100%;padding:12px 0 24px;border:12px solid #dc140a;border-bottom:0;border-top:0;position:relative}#grid-guide-layout > div:after{border-right:1px solid #666;content:'';position:absolute;right:-12px;top:0;height:100%}#grid-guide-layout.mobile div{border-width:6px}#grid-guide-layout.mobile > div:after{right:-6px}</style>");
    style.appendTo("body");
	
    var grid = $("<div>").attr("id", "grid-guide").css("height", 250);
    var gridLayout = $("<div>").attr("id", "grid-guide-layout");
    gridLayout.appendTo(grid);
    for (var i = 1; i < 13; i++) {
        $("<div>").text(i).appendTo(gridLayout);
    };
    grid.appendTo("body");
    grid.css("top", Math.max(0, (($(window).height() - $(grid).outerHeight()) / 2) + $(window).scrollTop()) + "px");
    grid.css("left", Math.max(0, (($(window).width() - $(grid).outerWidth()) / 2) + $(window).scrollLeft()) + "px");
		
    var jqueryUiRequired = true;
	var initGrid = function() {
        if ($.ui) {
            grid.draggable().resizable({ minHeight: 60,
				resize: function( event, ui ) {
					if(ui.size.width < 500 && !gridLayout.hasClass("mobile"))
					  gridLayout.addClass("mobile");
					else if(ui.size.width >= 500 && gridLayout.hasClass("mobile"))
						gridLayout.removeClass("mobile");
				  }
				});
        } else {
			if (jqueryUiRequired) {
				var script = document.createElement('script');
				script.type = "text/javascript";
				script.src = "//code.jquery.com/ui/1.11.4/jquery-ui.js";
				document.head.appendChild(script);
				
				var style = document.createElement('link');
				style.type = "text/css";
				style.rel = "stylesheet";
				style.href = "//code.jquery.com/ui/1.11.4/themes/smoothness/jquery-ui.css";
				document.head.appendChild(style);
            }
			
			jqueryUiRequired = false;
			window.setTimeout(initGrid, 100);
        }
    };
    initGrid();
}