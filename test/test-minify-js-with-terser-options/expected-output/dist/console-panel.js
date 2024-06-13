/*!
	console-panel
    A console panel within webpage to help in the following use-cases:
        * Get notification on console messages
        * Console logging on mobile and tablet devices
        * Console logging on Microsoft Edge / Internet Explorer (without opening native Developer Tools)
	https://github.com/webextensions/console-panel
	by Priyank Parashar (https://webextensions.org/)
	MIT License
*/
!function(e){if(!window.consolePanel){
/*! (C) WebReflection Mit Style License */
var o=function(e,o){var n="~",t="\\x"+("0"+n.charCodeAt(0).toString(16)).slice(-2),r="\\"+t,i=new o(t,"g"),l=new o(r,"g"),s=new o("(?:^|([^\\\\]))"+r),a=[].indexOf||function(e){for(var o=this.length;o--&&this[o]!==e;);return o},c=String;function d(e,o,t){return o instanceof Array?function(e,o,n){for(var t=0,r=o.length;t<r;t++)o[t]=d(e,o[t],n);return o}(e,o,t):o instanceof c?o.length?t.hasOwnProperty(o)?t[o]:t[o]=function(e,o){for(var t=0,r=o.length;t<r;e=e[o[t++].replace(l,n)]);return e}(e,o.split(n)):e:o instanceof Object?function(e,o,n){for(var t in o)o.hasOwnProperty(t)&&(o[t]=d(e,o[t],n));return o}(e,o,t):o}var u={stringify:function(e,o,l,s){return u.parser.stringify(e,function(e,o,l){var s,c,d=!1,u=!!o,f=[],p=[e],g=[e],h=[l?n:"[Circular]"],v=e,m=1;return u&&(c="object"==typeof o?function(e,n){return""!==e&&o.indexOf(e)<0?void 0:n}:o),function(e,o){return u&&(o=c.call(this,e,o)),d?(v!==this&&(s=m-a.call(p,this)-1,m-=s,p.splice(m,p.length),f.splice(m-1,f.length),v=this),"object"==typeof o&&o?(a.call(p,o)<0&&p.push(v=o),m=p.length,(s=a.call(g,o))<0?(s=g.push(o)-1,l?(f.push((""+e).replace(i,t)),h[s]=n+f.join(n)):h[s]=h[0]):o=h[s]):"string"==typeof o&&l&&(o=o.replace(t,r).replace(n,t))):d=!0,o}}(e,o,!s),l)},parse:function(e,o){return u.parser.parse(e,function(e){return function(o,i){var l="string"==typeof i;return l&&i.charAt(0)===n?new c(i.slice(1)):(""===o&&(i=d(i,i,{})),l&&(i=i.replace(s,"$1"+n).replace(r,t)),e?e.call(this,o,i):i)}}(o))},parser:e};return u}(JSON,RegExp);!function(){if("function"==typeof window.CustomEvent)return!1;function e(e,o){o=o||{bubbles:!1,cancelable:!1,detail:void 0};var n=document.createEvent("CustomEvent");return n.initCustomEvent(e,o.bubbles,o.cancelable,o.detail),n}e.prototype=window.Event.prototype,window.CustomEvent=e}();var n=function(){var e,o=window,n=document,t=n.documentElement,r=n.createElement("div");r.id="topCenterAlertNote";var i=function(e){e.style.display="none"},l=function(){o.clearTimeout(e)},s=function(n,s,a){var c=(a=a||{}).verticalAlignment||"top",d=a.horizontalAlignment||"center",u=a.textAlignment||d,f=a.backgroundColor||"#f9edbe",p=a.borderColor||"#eb7",g=a.opacity||"1",h=a.unobtrusive||!1;if(r.innerHTML=['<div style="pointer-events:none;position:fixed;width:100%;z-index:2147483600;'+("bottom"===c?"bottom:0;":"top:0;")+("left"===d?"left:0;":"right"===d?"right:0;":"left:0;")+"text-align:"+d+";opacity:"+g+';">','<div style="display:flex;width:auto;margin:0;padding:0;border:0;'+("left"===d?"justify-content:flex-start;":"right"===d?"justify-content:flex-end;":"justify-content:center;")+'">','<div style="pointer-events:initial;border:1px solid '+p+";background-color:"+f+';padding:2px 10px;max-width:980px;overflow:hidden;text-align:left;font-family:Arial,sans-serif;font-weight:bold;font-size:12px">','<div class="alert-note-text" style="color:#000;text-align:'+u+';word-wrap:break-word;">',n,"</div>","</div>","</div>","</div>"].join(""),h)try{var v=r.firstChild.firstChild.firstChild;v.addEventListener("mouseenter",(function(){v.style.transition="opacity 0.3s ease-out",v.style.opacity="0",v.style.pointerEvents="none"}),!1)}catch(e){}r.style.display="",t.appendChild(r),l(),e=o.setTimeout((function(){i(r)}),s||5e3)};return s.hide=function(){i(r),l()},s}(),t="Disable for this instance",r={};
/*!
        devtools-detect
        Detect if DevTools is open
        https://github.com/sindresorhus/devtools-detect
        by Sindre Sorhus
        MIT License
    */
!function(e){"use strict";var o={open:!1,orientation:null},n=160,t=function(e,o){window.dispatchEvent(new CustomEvent("console-panel-devtoolschange",{detail:{open:e,orientation:o}}))};(e=e||{}).getDevToolsStatus=function(){var e={},o=window.outerWidth-window.innerWidth>n,t=window.outerHeight-window.innerHeight>n,r=o?"vertical":"horizontal";return t&&o||!(window.Firebug&&window.Firebug.chrome&&window.Firebug.chrome.isInitialized||o||t)?(e.open=!1,e.orientation=null):(e.open=!0,e.orientation=r),e};var r=function(){var e=window.outerWidth-window.innerWidth>n,r=window.outerHeight-window.innerHeight>n,i=e?"vertical":"horizontal";return r&&e||!(window.Firebug&&window.Firebug.chrome&&window.Firebug.chrome.isInitialized||e||r)?(o.open&&t(!1,null),o.open=!1,o.orientation=null):(o.open&&o.orientation===i||t(!0,i),o.open=!0,o.orientation=i),o};e.updateDevToolsStatus=r,window.addEventListener("resize",(function(e){e.target===window&&r()}))}(r);var i=function(e){"loading"!==document.readyState?e():document.addEventListener("DOMContentLoaded",e)},l=function(e){return"userPreference-"+e},s={};s[l("consolePanelHeight")]="250";var a,c=function(e,o){var n=l(e);if(void 0!==o)return function(e,o){try{return localStorage[e]=o,!0}catch(e){return!1}}(n,o);var t=function(e){try{return localStorage[e]}catch(e){return}}(n);return void 0===t?s[n]:t},d=function(e){return(""+e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#x27;").replace(/\//g,"&#x2F;")},u=function(e,o){e.innerHTML=d(o)},f=function(e){return e=(e=(e=e||"").replace(/:[0-9]+$/,"")).replace(/:[0-9]+$/,"")},p=function(e){var o,n=e.skipLevels||1,t="";if(Object.keys(e).indexOf("stack")>=0)t=e.stack?e.stack:"";else try{throw new Error("")}catch(e){t=e.stack||""}-1!==navigator.userAgent.toLowerCase().indexOf("gecko")&&-1===navigator.userAgent.toLowerCase().indexOf("like gecko")?(o=t.split(/\n[\s]*/).map((function(e){var o=e.split("@");return o[o.length-1]}))).splice(0,n-1):(o=t.split(/\n[\s]+at[\s]/)).splice(0,n);var r=t.split(/\n/);"Error"===r[0]?r.splice(1,n-1):r.splice(0,n-1),r=r.join("\n");var i,l=o[0];return l&&l.indexOf("(")>=0&&(l=(l=l.substr(l.indexOf("(")+1)).substr(0,l.indexOf(")"))),{stack:r,resourceLineCharacter:(i=l,i=(i=i||"").split("/").pop()),resourceUrlLineCharacter:l,resourceUrl:f(l)}},g=function(e,o,n,t){t=t||e;var r=e[o];return e[o]=function(){"function"==typeof r&&r.apply(t,arguments),n.apply(t,arguments)},r};a=Object.getPrototypeOf(console).log?Object.getPrototypeOf(console):console;var h=function(){var f=function(){this.originals={},this.arrLogs=[],this.config={reportLogLines:!0},this.domReady=!1,this.enabled=!1};return f.prototype.setButtonPosition=function(e){this.devToolsIconContainer.className="dev-tools-icon-container dev-tools-icon-container-"+e},f.prototype.showDevToolsIconContainer=function(){this.isConsolePanelVisible()||(this.devToolsIconContainer.style.display="block")},f.prototype.hideDevToolsIconContainer=function(){this.devToolsIconContainer.style.display="none"},f.prototype.isDevToolsIconContainerVisible=function(){return"block"===this.devToolsIconContainer.style.display},f.prototype.isConsolePanelVisible=function(){return"block"===this.devTools.style.display},f.prototype.hideConsolePanel=function(){this.devTools.style.display="none"},f.prototype.showConsolePanel=function(){this.devTools.style.display="block",this.flushLogsToUIAsync()},f.prototype.hideBecauseDevToolsIsOpen=function(){var e=this;n("Disabled console-panel",null,{verticalAlignment:"bottom",horizontalAlignment:"right"}),e.disable(),e.hideDevToolsIconContainer(),e.hideConsolePanel()},f.prototype.showBecauseDevToolsIsClosed=function(){var e=this;e.enable(e.config),e.isDevToolsIconContainerVisible()?n.hide():n("Enabled console-panel",null,{verticalAlignment:"bottom",horizontalAlignment:"right"})},f.prototype.hasStrongNotification=function(){for(var e=this.config.strongNotificationFor,o=this.config.skipStrongNotificationIfNoStackTrace,n=!1,t=this.arrLogs,r=0;r<t.length;r++){var i=t[r],l=i.logMode;if(Date.now()<=t[r].time.getTime()+1500)if(o&&!i.initiator.stack);else if("window.onerror"===l&&e.indexOf("window.onerror")>=0||"error"===l&&e.indexOf("console.error")>=0||"warn"===l&&e.indexOf("console.warn")>=0||"info"===l&&e.indexOf("console.info")>=0||"log"===l&&e.indexOf("console.log")>=0){n=!0;break}}return n},f.prototype.getRecommendedClassNameForDevToolsIcon=function(){for(var e="found-something",o=!1,n=!1,t=!1,r=!1,i=this.arrLogs,l=0;l<i.length;l++){var s=i[l].logMode;"error"===s||"window.onerror"===s?o=!0:"warn"===s?n=!0:"info"===s?t=!0:"log"===s&&(r=!0)}return o?e="found-error":n?e="found-warn":t?e="found-info":r&&(e="found-log"),e},f.prototype.areThereUnreadRelevantMessages=function(e){var o=this.arrLogs;if(o.length){if("all"===e)return!0;if(Array.isArray(e))for(var n=0;n<o.length;n++){var t=o[n].logMode;if("window.onerror"!==t&&(t="console."+t),e.indexOf(t)>=0)return!0}}return!1},f.prototype.flushCountToIcon=function(){var e=this.devToolsIconStrongNotification,o=this.devToolsIcon;if(this.config.showOnlyForTheseRelevantMessages){var n=this.config.showOnlyForTheseRelevantMessages;this.areThereUnreadRelevantMessages(n)&&this.showDevToolsIconContainer()}var t=this.arrLogs;if(t.length){o.innerHTML=t.length,o.title=t.length+" unread message"+(1===t.length?"":"s");var r=this.getRecommendedClassNameForDevToolsIcon(),i=this.hasStrongNotification();if(o.className="dev-tools-icon "+r,e.className=i?"strong-notification":"",i){var l=Date.now();e.setAttribute("data-last-strong-notification",l);setTimeout((function(){l===parseInt(e.getAttribute("data-last-strong-notification"),10)&&(e.removeAttribute("data-last-strong-notification"),e.classList.remove("strong-notification"))}),1500)}}else o.innerHTML="",o.removeAttribute("title"),o.className="dev-tools-icon no-unread-messages",e.classList.remove("strong-notification")},f.prototype.flushLogsToUIAsync=function(){var e=this;requestAnimationFrame((function(){requestAnimationFrame((function(){e.flushLogsToUI()}))}))},f.prototype.flushLogsToUI=function(){if(this.flushCountToIcon(),this.isConsolePanelVisible()){var e=!1,o=this.logger;o.scrollHeight===o.scrollTop+o.offsetHeight&&(e=!0);for(var n=this.arrLogs;n.length;){var t=n.shift(),r=t.logMode,i=t.logEntry,l=t.initiator,s=t.time,a=document.createElement("div");this.loggerBody.appendChild(a),a.title="Logged at "+s.toTimeString().substring(0,8),a.className="dev-tools-console-message-wrapper "+("log"===r?"log-mode-log":"info"===r?"log-mode-info":"warn"===r?"log-mode-warn":"error"===r?"log-mode-error":"window.onerror"===r?"log-mode-window-onerror":"clear"===r?"log-mode-clear":"unhandled"===r?"log-mode-unhandled":"log-mode-unknown");var c=document.createElement("div");a.appendChild(c),c.className="dev-tools-console-message-code-line",c.innerHTML=function(e){return e.resourceLineCharacter?'<a target="_blank" style="color:#545454; font-family:monospace;" href="'+d(e.resourceUrl)+'" title="'+d(e.resourceUrlLineCharacter)+'">'+d(e.resourceLineCharacter)+"</a>":""}(l);var f,p=document.createElement("div");if(a.appendChild(p),p.className="dev-tools-console-message",0===i.length)f=document.createElement("span"),p.appendChild(f),f.innerHTML=" ";else for(var g=0;g<i.length;g++){if(g>0){var h=document.createElement("span");p.appendChild(h),h.innerHTML=" "}f=document.createElement("span"),p.appendChild(f);!function(e){var o=e.className||"log-value-unknown",n=e.valueToLog,t=f;if(t.className=o,"log-value-unknown"===o||"log-value-object"===o||"log-value-array"===o)if("undefined"==typeof JSONEditor)t.classList.add("jsoneditor-not-available"),Array.isArray(n)?u(t,String("["+n.length+"]")):u(t,"object"==typeof n?String("{"+Object.keys(n).length+"}"):String(typeof n)+" ("+String(n)+")");else{var r=new JSONEditor(t,{mode:"view",navigationBar:!1,search:!1,sortObjectKeys:!0});r.set(n),r.collapseAll()}else if("log-value-dom"===o){var i=n.split("\n")[0],l=!1;i!==n&&(l=!0);var s=function(){var e=document.createElement("span");return t.appendChild(e),e.className="all-lines-of-code",e.innerHTML='<pre><code class="language-markup">'+d(n)+"</code></pre>","undefined"!=typeof Prism&&Prism.highlightAllUnder(e),e};if(l){var a,c=document.createElement("span");t.appendChild(c),c.className="console-panel-expand-collapse console-panel-collapsed";var p=document.createElement("span");t.appendChild(p),p.className="only-first-line-of-code",p.innerHTML='<pre><code class="language-markup">'+d(i)+"</code></pre>","undefined"!=typeof Prism&&Prism.highlightAllUnder(p),c.addEventListener("click",(function(e){c.classList.contains("console-panel-collapsed")?(p.style.display="none",a?a.style.display="":a=s()):(p.style.display="",a.style.display="none"),c.classList.toggle("console-panel-collapsed"),c.classList.toggle("console-panel-expanded")}))}else s()}else t.innerHTML=String(n)}(i[g])}if(["error","warn"].indexOf(r)>=0&&l.stack){var v=document.createElement("div");p.appendChild(v),v.className="log-call-stack";var m=l.stack.split("\n");m.shift(),m=m.join("\n"),v.innerHTML=d(m)}}e&&a&&a.scrollIntoView(!1),this.flushCountToIcon()}},f.prototype.logArrayEntry=function(e){var n,t,r=e.type||"unknown",i=e.initiator||{},l=e.value,s="log-value-unknown",a="not-handled";if("boolean"===r)s="log-value-boolean",a=l;else if("number"===r)s="log-value-number",a=l;else if("string"===r)s="log-value-string",a=d((n=l.toString(),!(t=5003)||t<=3?n:n.length>t?n.substr(0,t-3)+"...":n));else if("document.all"===r)s="log-value-document-all",a=l;else if("undefined"===r)s="log-value-undefined",a=l;else if("null"===r)s="log-value-null",a=l;else if("function"===r)s="log-value-function",a=l;else if("console.clear"===r)s="log-value-console-clear",a=l;else if("dom"===r)s="log-value-dom",a=l.outerHTML;else if("dom-text"===r)s="log-value-dom-text",a=l.textContent;else if("window.onerror"===r){s="log-value-window-onerror";var c=function(){var e="An error occurred",o=l.error;try{e=o[4].stack}catch(o){try{e=l.error[0]+"\n"+l.error[1]+":"+l.error[2]+(void 0===l.error[3]?"":":"+l.error[3])}catch(e){}}return e}();a=d(c)}else"array"===r?(s="log-value-array",a=JSON.parse(o.stringify(l,null,"","[Circular]"))):"object"===r?(s="log-value-object",a=JSON.parse(o.stringify(l,null,"","[Circular]"))):(s="log-value-unknown",a=JSON.parse(o.stringify(l,null,"","[Circular]")));return{className:s,initiator:i,valueToLog:a}},f.prototype.markLogEntry=function(e,o){for(var n=[],t=0;t<o.length;t++){var r=o[t],l="unknown";l="boolean"==typeof r?"boolean":"function"==typeof r?"function":"number"==typeof r?"number":"string"==typeof r?"string":"symbol"==typeof r?"unknown":"object"==typeof r?null===r?"null":r instanceof HTMLElement?"dom":r instanceof Text?"dom-text":"window.onerror"===e?"window.onerror":Array.isArray(r)?"array":"object":void 0===r?r===document.all?"document.all":"undefined":"unknown",n.push(this.logArrayEntry({type:l,value:r}))}var s={logMode:e,time:new Date,logEntry:n};this.config.reportLogLines?s.initiator=p("window.onerror"===e?{skipLevels:0,stack:(o[0].error[4]||{}).stack}:{skipLevels:5}):s.initiator={};var a=this;a.arrLogs.push(s),i((function(){a.flushLogsToUIAsync()}))},f.prototype.clear=function(){var e=this,o=e.config.reportLogLines;e.arrLogs=[],e.arrLogs.push({logMode:"clear",time:new Date,logEntry:[e.logArrayEntry({type:"console.clear",value:"Console was cleared"})],initiator:o?p({skipLevels:4}):{}}),e.loggerBody.innerHTML="",e.flushLogsToUIAsync()},f.prototype.setupIntercept=function(){var e=this,o=e.originals,n=e.config.functionsToIntercept,t=function(e,o,t){return"all"===n||n.indexOf(e)>=0?t():o};o["window.onerror"]=t("window.onerror",o["window.onerror"],(function(){return g(window,"onerror",(function(){e.markLogEntry("window.onerror",[{error:arguments}])}))})),o["console.clear"]=g(a,"clear",(function(){e.clear()}),console),o["console.log"]=t("console.log",o["console.log"],(function(){return g(a,"log",(function(){e.markLogEntry("log",arguments)}),console)})),o["console.info"]=t("console.info",o["console.info"],(function(){return g(a,"info",(function(){e.markLogEntry("info",arguments)}),console)})),o["console.warn"]=t("console.warn",o["console.warn"],(function(){return g(a,"warn",(function(){e.markLogEntry("warn",arguments)}),console)})),o["console.error"]=t("console.error",o["console.error"],(function(){return g(a,"error",(function(){e.markLogEntry("error",arguments)}),console)})),Object.keys(a).forEach((function(n){-1===["log","info","warn","error","clear"].indexOf(n)&&"function"==typeof a[n]&&(o["console."+n]=t(n,o["console."+n],(function(){return g(a,n,(function(){e.markLogEntry("unhandled",arguments)}),console)})))}))},f.prototype.render=function(){var o=this,i=document.createElement("div");i.id="console-panel",document.body.appendChild(i);var a=document.createElement("div");this.devToolsIconContainer=a,i.appendChild(a);var d=document.createElement("div");this.devToolsIconStrongNotification=d,a.appendChild(d);var u=document.createElement("div");this.devToolsIcon=u,u.className="dev-tools-icon no-unread-messages",u.addEventListener("click",(function(e){o.showConsolePanel(),o.hideDevToolsIconContainer()})),this.hideDevToolsIconContainer(),d.appendChild(u);var f,p=document.createElement("div");this.devTools=p,i.appendChild(p),p.className="dev-tools",this.hideConsolePanel(),p.style.height=((f=parseInt(c("consolePanelHeight"),10))>=0&&f<=1/0||(f=s[l("consolePanelHeight")]),f+"px");var g=document.createElement("div");p.appendChild(g),g.className="dev-tools-header";var h=document.createElement("div");g.appendChild(h),h.className="dev-tools-resize-handle",h.innerHTML="&nbsp;";var v=document.createElement("div");g.appendChild(v),v.title="Close",v.className="dev-tools-header-cross-icon",v.addEventListener("click",(function(e){o.hideConsolePanel(),o.showDevToolsIconContainer()}));var m=document.createElement("div");o.disableIcon=m,m.title=t,m.className="dev-tools-header-disable-icon",m.addEventListener("click",(function(e){if(o.config&&"function"==typeof o.config.beforeDisableButtonClick&&!1===o.config.beforeDisableButtonClick())return;o.hideConsolePanel(),o.disable()})),g.appendChild(m);var y=document.createElement("div");g.appendChild(y),y.title="Clear",y.className="dev-tools-clear-console-icon",y.addEventListener("click",(function(e){o.clear(),console.clear()}));var w=document.createElement("div");if(g.appendChild(w),w.innerHTML="Console",w.style.cssFloat="left",e&&e.fn&&e.fn.resizable)try{var b=e(".dev-tools");e.ui?(h.classList.add("ui-resizable-handle"),h.classList.add("ui-resizable-n"),b.resizable({handles:{n:b.find(".dev-tools-resize-handle")},stop:function(e,o){c("consolePanelHeight",o.size.height)}})):b.resizable({handleSelector:".dev-tools-resize-handle",resizeWidth:!1,resizeHeightFrom:"top",onDragEnd:function(e,o,n){c("consolePanelHeight",o.outerHeight())}}),h.style.cursor="n-resize"}catch(e){n('Error in setting up "resize" for console-panel (<a target="_blank" href="https://github.com/webextensions/console-panel#full-featured-setup">Learn more</a>)',1e4)}var T=document.createElement("div");this.logger=T,p.appendChild(T),T.className="dev-tools-console";var L=document.createElement("div");T.appendChild(L),L.className="dev-tools-console-header";var C=document.createElement("div");this.loggerBody=C,T.appendChild(C),C.className="dev-tools-console-body",window.addEventListener("console-panel-devtoolschange",(function(e){o.config.doNotUseWhenDevToolsMightBeOpenInTab&&(e.detail.open?o.hideBecauseDevToolsIsOpen():o.showBecauseDevToolsIsClosed())})),r.updateDevToolsStatus()},f.prototype.enable=function(e){e=e||{};var o=this;o.enabled&&o.disable();var n=Array.isArray(e.functionsToIntercept)?e.functionsToIntercept:"all",l=e.showOnlyForTheseRelevantMessages||null,s=e.strongNotificationFor||["window.onerror","console.error"],a=e.skipStrongNotificationIfNoStackTrace||!1,c=void 0===e.reportLogLines||!!e.reportLogLines,d=void 0!==e.doNotUseWhenDevToolsMightBeOpenInTab&&e.doNotUseWhenDevToolsMightBeOpenInTab,u="string"==typeof e.disableButtonTitle&&""!==e.disableButtonTitle?e.disableButtonTitle:t,f=e.beforeDisableButtonClick,p=function(){switch(e.position){case"top-left":case"top-right":case"bottom-left":case"bottom-right":case"left-top":case"left-bottom":case"right-top":case"right-bottom":return e.position;default:return"bottom-right"}}();!function(e){e.functionsToIntercept=n,e.showOnlyForTheseRelevantMessages=l,e.strongNotificationFor=s,e.skipStrongNotificationIfNoStackTrace=a,e.doNotUseWhenDevToolsMightBeOpenInTab=d,e.disableButtonTitle=u,e.beforeDisableButtonClick=f,e.position=p}(o.config),o.setupIntercept(),c?o.enableReportLogLines():o.disableReportLogLines(),o.domReady||i((function(){o.render(),o.domReady=!0})),i((function(){var e;o.setButtonPosition(p),o.disableIcon.title=u,l||o.config.doNotUseWhenDevToolsMightBeOpenInTab&&((e=r.getDevToolsStatus())&&e.open)||o.showDevToolsIconContainer(),o.flushLogsToUIAsync()})),o.enabled=!0},f.prototype.disable=function(){var e=this;window.onerror=e.originals["window.onerror"],Object.keys(a).forEach((function(o){e.originals["console."+o]&&(a[o]=e.originals["console."+o])})),e.enabled=!1},f.prototype.enableReportLogLines=function(){this.config.reportLogLines=!0},f.prototype.disableReportLogLines=function(){this.config.reportLogLines=!1},f}();window.consolePanel=new h}}(window.jQuery);