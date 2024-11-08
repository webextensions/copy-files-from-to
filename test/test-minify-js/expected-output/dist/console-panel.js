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
!function($){if(!window.consolePanel){
/*! (C) WebReflection Mit Style License */
var CircularJSON=function(JSON,RegExp){var safeSpecialChar="\\x"+("0"+"~".charCodeAt(0).toString(16)).slice(-2),escapedSafeSpecialChar="\\"+safeSpecialChar,specialCharRG=new RegExp(safeSpecialChar,"g"),safeSpecialCharRG=new RegExp(escapedSafeSpecialChar,"g"),safeStartWithSpecialCharRG=new RegExp("(?:^|([^\\\\]))"+escapedSafeSpecialChar),indexOf=[].indexOf||function(v){for(var i=this.length;i--&&this[i]!==v;);return i},$String=String
function regenerate(root,current,retrieve){return current instanceof Array?function(root,current,retrieve){for(var i=0,length=current.length;i<length;i++)current[i]=regenerate(root,current[i],retrieve)
return current}(root,current,retrieve):current instanceof $String?current.length?retrieve.hasOwnProperty(current)?retrieve[current]:retrieve[current]=function(current,keys){for(var i=0,length=keys.length;i<length;current=current[keys[i++].replace(safeSpecialCharRG,"~")]);return current}(root,current.split("~")):root:current instanceof Object?function(root,current,retrieve){for(var key in current)current.hasOwnProperty(key)&&(current[key]=regenerate(root,current[key],retrieve))
return current}(root,current,retrieve):current}var CircularJSON={stringify:function(value,replacer,space,doNotResolve){return CircularJSON.parser.stringify(value,function(value,replacer,resolve){var i,fn,doNotIgnore=!1,inspect=!!replacer,path=[],all=[value],seen=[value],mapp=[resolve?"~":"[Circular]"],last=value,lvl=1
inspect&&(fn="object"==typeof replacer?function(key,value){return""!==key&&replacer.indexOf(key)<0?void 0:value}:replacer)
return function(key,value){inspect&&(value=fn.call(this,key,value))
if(doNotIgnore){if(last!==this){i=lvl-indexOf.call(all,this)-1
lvl-=i
all.splice(lvl,all.length)
path.splice(lvl-1,path.length)
last=this}if("object"==typeof value&&value){indexOf.call(all,value)<0&&all.push(last=value)
lvl=all.length
if((i=indexOf.call(seen,value))<0){i=seen.push(value)-1
if(resolve){path.push((""+key).replace(specialCharRG,safeSpecialChar))
mapp[i]="~"+path.join("~")}else mapp[i]=mapp[0]}else value=mapp[i]}else"string"==typeof value&&resolve&&(value=value.replace(safeSpecialChar,escapedSafeSpecialChar).replace("~",safeSpecialChar))}else doNotIgnore=!0
return value}}(value,replacer,!doNotResolve),space)},parse:function(text,reviver){return CircularJSON.parser.parse(text,function(reviver){return function(key,value){var isString="string"==typeof value
if(isString&&"~"===value.charAt(0))return new $String(value.slice(1))
""===key&&(value=regenerate(value,value,{}))
isString&&(value=value.replace(safeStartWithSpecialCharRG,"$1~").replace(escapedSafeSpecialChar,safeSpecialChar))
return reviver?reviver.call(this,key,value):value}}(reviver))},parser:JSON}
return CircularJSON}(JSON,RegExp)
!function(){if("function"==typeof window.CustomEvent)return!1
function CustomEvent(event,params){params=params||{bubbles:!1,cancelable:!1,detail:void 0}
var evt=document.createEvent("CustomEvent")
evt.initCustomEvent(event,params.bubbles,params.cancelable,params.detail)
return evt}CustomEvent.prototype=window.Event.prototype
window.CustomEvent=CustomEvent}()
var alertNote=function(){var t,w=window,d=document,dE=d.documentElement,div=d.createElement("div")
div.id="topCenterAlertNote"
var h=function(div){div.style.display="none"},clearTimeout=function(){w.clearTimeout(t)},alertNote=function(msg,hideDelay,options){var verticalAlignment=(options=options||{}).verticalAlignment||"top",horizontalAlignment=options.horizontalAlignment||"center",textAlignment=options.textAlignment||horizontalAlignment,backgroundColor=options.backgroundColor||"#f9edbe",borderColor=options.borderColor||"#eb7",opacity=options.opacity||"1",unobtrusive=options.unobtrusive||!1
div.innerHTML=['<div style="pointer-events:none;position:fixed;width:100%;z-index:2147483600;'+("bottom"===verticalAlignment?"bottom:0;":"top:0;")+("left"===horizontalAlignment?"left:0;":"right"===horizontalAlignment?"right:0;":"left:0;")+"text-align:"+horizontalAlignment+";opacity:"+opacity+';">','<div style="display:flex;width:auto;margin:0;padding:0;border:0;'+("left"===horizontalAlignment?"justify-content:flex-start;":"right"===horizontalAlignment?"justify-content:flex-end;":"justify-content:center;")+'">','<div style="pointer-events:initial;border:1px solid '+borderColor+";background-color:"+backgroundColor+';padding:2px 10px;max-width:980px;overflow:hidden;text-align:left;font-family:Arial,sans-serif;font-weight:bold;font-size:12px">','<div class="alert-note-text" style="color:#000;text-align:'+textAlignment+';word-wrap:break-word;">',msg,"</div>","</div>","</div>","</div>"].join("")
if(unobtrusive)try{var firstChild=div.firstChild.firstChild.firstChild
firstChild.addEventListener("mouseenter",(function(){firstChild.style.transition="opacity 0.3s ease-out"
firstChild.style.opacity="0"
firstChild.style.pointerEvents="none"}),!1)}catch(e){}div.style.display=""
dE.appendChild(div)
clearTimeout()
t=w.setTimeout((function(){h(div)}),hideDelay||5e3)}
alertNote.hide=function(){h(div)
clearTimeout()}
return alertNote}(),constants_DISABLE_FOR_THIS_INSTANCE="Disable for this instance",moduleGlobal={}

;/*!
        devtools-detect
        Detect if DevTools is open
        https://github.com/sindresorhus/devtools-detect
        by Sindre Sorhus
        MIT License
    */
!function(scope){"use strict"
var devtools={open:!1,orientation:null},emitEvent=function(state,orientation){window.dispatchEvent(new CustomEvent("console-panel-devtoolschange",{detail:{open:state,orientation:orientation}}))};(scope=scope||{}).getDevToolsStatus=function(){var devtoolsStatus={},widthThreshold=window.outerWidth-window.innerWidth>160,heightThreshold=window.outerHeight-window.innerHeight>160,orientation=widthThreshold?"vertical":"horizontal"
if(heightThreshold&&widthThreshold||!(window.Firebug&&window.Firebug.chrome&&window.Firebug.chrome.isInitialized||widthThreshold||heightThreshold)){devtoolsStatus.open=!1
devtoolsStatus.orientation=null}else{devtoolsStatus.open=!0
devtoolsStatus.orientation=orientation}return devtoolsStatus}
var updateDevToolsStatus=function(){var widthThreshold=window.outerWidth-window.innerWidth>160,heightThreshold=window.outerHeight-window.innerHeight>160,orientation=widthThreshold?"vertical":"horizontal"
if(heightThreshold&&widthThreshold||!(window.Firebug&&window.Firebug.chrome&&window.Firebug.chrome.isInitialized||widthThreshold||heightThreshold)){devtools.open&&emitEvent(!1,null)
devtools.open=!1
devtools.orientation=null}else{devtools.open&&devtools.orientation===orientation||emitEvent(!0,orientation)
devtools.open=!0
devtools.orientation=orientation}return devtools}
scope.updateDevToolsStatus=updateDevToolsStatus
window.addEventListener("resize",(function(e){e.target===window&&updateDevToolsStatus()}))}(moduleGlobal)
var ready=function(cb){"loading"!==document.readyState?cb():document.addEventListener("DOMContentLoaded",cb)},getFullKey=function(key){return"userPreference-"+key},defaultUserPreference={}
defaultUserPreference[getFullKey("consolePanelHeight")]="250"
var varConsole,userPreference=function(preference,value){var fullKey=getFullKey(preference)
if(void 0!==value)return function(key,value){try{localStorage[key]=value
return!0}catch(e){return!1}}(fullKey,value)
var retValue=function(key){try{return localStorage[key]}catch(e){return}}(fullKey)
return void 0===retValue?defaultUserPreference[fullKey]:retValue},sanitizeHTML=function(html){return(""+html).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#x27;").replace(/\//g,"&#x2F;")},sanitizedInnerHTML=function(el,html){el.innerHTML=sanitizeHTML(html)},getResourceUrlFromPath=function(path){return path=(path=(path=path||"").replace(/:[0-9]+$/,"")).replace(/:[0-9]+$/,"")},getCurrentExecutionDetails=function(options){var arrStack,skipLevels=options.skipLevels||1,errStr=""
if(Object.keys(options).indexOf("stack")>=0)errStr=options.stack?options.stack:""
else try{throw new Error("")}catch(e){errStr=e.stack||""}-1!==navigator.userAgent.toLowerCase().indexOf("gecko")&&-1===navigator.userAgent.toLowerCase().indexOf("like gecko")?(arrStack=errStr.split(/\n[\s]*/).map((function(str){var split=str.split("@")
return split[split.length-1]}))).splice(0,skipLevels-1):(arrStack=errStr.split(/\n[\s]+at[\s]/)).splice(0,skipLevels)
var stackToReport=errStr.split(/\n/)
"Error"===stackToReport[0]?stackToReport.splice(1,skipLevels-1):stackToReport.splice(0,skipLevels-1)
stackToReport=stackToReport.join("\n")
var path,relevantString=arrStack[0]
relevantString&&relevantString.indexOf("(")>=0&&(relevantString=(relevantString=relevantString.substr(relevantString.indexOf("(")+1)).substr(0,relevantString.indexOf(")")))
return{stack:stackToReport,resourceLineCharacter:(path=relevantString,path=(path=path||"").split("/").pop()),resourceUrlLineCharacter:relevantString,resourceUrl:getResourceUrlFromPath(relevantString)}},after=function(object,method,fn,context){context=context||object
var originalMethod=object[method]
object[method]=function(){"function"==typeof originalMethod&&originalMethod.apply(context,arguments)
fn.apply(context,arguments)}
return originalMethod}
varConsole=Object.getPrototypeOf(console).log?Object.getPrototypeOf(console):console
var ConsolePanel=function(){var ConsolePanel=function(){this.originals={}
this.arrLogs=[]
this.config={reportLogLines:!0}
this.domReady=!1
this.enabled=!1}
ConsolePanel.prototype.setButtonPosition=function(position){this.devToolsIconContainer.className="dev-tools-icon-container dev-tools-icon-container-"+position}
ConsolePanel.prototype.showDevToolsIconContainer=function(){this.isConsolePanelVisible()||(this.devToolsIconContainer.style.display="block")}
ConsolePanel.prototype.hideDevToolsIconContainer=function(){this.devToolsIconContainer.style.display="none"}
ConsolePanel.prototype.isDevToolsIconContainerVisible=function(){return"block"===this.devToolsIconContainer.style.display}
ConsolePanel.prototype.isConsolePanelVisible=function(){return"block"===this.devTools.style.display}
ConsolePanel.prototype.hideConsolePanel=function(){this.devTools.style.display="none"}
ConsolePanel.prototype.showConsolePanel=function(){this.devTools.style.display="block"
this.flushLogsToUIAsync()}
ConsolePanel.prototype.hideBecauseDevToolsIsOpen=function(){alertNote("Disabled console-panel",null,{verticalAlignment:"bottom",horizontalAlignment:"right"})
this.disable()
this.hideDevToolsIconContainer()
this.hideConsolePanel()}
ConsolePanel.prototype.showBecauseDevToolsIsClosed=function(){this.enable(this.config)
this.isDevToolsIconContainerVisible()?alertNote.hide():alertNote("Enabled console-panel",null,{verticalAlignment:"bottom",horizontalAlignment:"right"})}
ConsolePanel.prototype.hasStrongNotification=function(){for(var strongNotificationFor=this.config.strongNotificationFor,skipStrongNotificationIfNoStackTrace=this.config.skipStrongNotificationIfNoStackTrace,showStrongNotification=!1,arrLogs=this.arrLogs,i=0;i<arrLogs.length;i++){var log=arrLogs[i],logMode=log.logMode
if(Date.now()<=arrLogs[i].time.getTime()+1500)if(skipStrongNotificationIfNoStackTrace&&!log.initiator.stack);else if("window.onerror"===logMode&&strongNotificationFor.indexOf("window.onerror")>=0||"error"===logMode&&strongNotificationFor.indexOf("console.error")>=0||"warn"===logMode&&strongNotificationFor.indexOf("console.warn")>=0||"info"===logMode&&strongNotificationFor.indexOf("console.info")>=0||"log"===logMode&&strongNotificationFor.indexOf("console.log")>=0){showStrongNotification=!0
break}}return showStrongNotification}
ConsolePanel.prototype.getRecommendedClassNameForDevToolsIcon=function(){for(var recommendedClassName="found-something",foundError=!1,foundWarn=!1,foundInfo=!1,foundLog=!1,arrLogs=this.arrLogs,i=0;i<arrLogs.length;i++){var logMode=arrLogs[i].logMode
"error"===logMode||"window.onerror"===logMode?foundError=!0:"warn"===logMode?foundWarn=!0:"info"===logMode?foundInfo=!0:"log"===logMode&&(foundLog=!0)}foundError?recommendedClassName="found-error":foundWarn?recommendedClassName="found-warn":foundInfo?recommendedClassName="found-info":foundLog&&(recommendedClassName="found-log")
return recommendedClassName}
ConsolePanel.prototype.areThereUnreadRelevantMessages=function(relevantMessages){var arrLogs=this.arrLogs
if(arrLogs.length){if("all"===relevantMessages)return!0
if(Array.isArray(relevantMessages))for(var i=0;i<arrLogs.length;i++){var normalizedLogMode=arrLogs[i].logMode
"window.onerror"!==normalizedLogMode&&(normalizedLogMode="console."+normalizedLogMode)
if(relevantMessages.indexOf(normalizedLogMode)>=0)return!0}}return!1}
ConsolePanel.prototype.flushCountToIcon=function(){var devToolsIconStrongNotification=this.devToolsIconStrongNotification,devToolsIcon=this.devToolsIcon
if(this.config.showOnlyForTheseRelevantMessages){var relevantMessages=this.config.showOnlyForTheseRelevantMessages
this.areThereUnreadRelevantMessages(relevantMessages)&&this.showDevToolsIconContainer()}var arrLogs=this.arrLogs
if(arrLogs.length){devToolsIcon.innerHTML=arrLogs.length
devToolsIcon.title=arrLogs.length+" unread message"+(1===arrLogs.length?"":"s")
var recommendedClassName=this.getRecommendedClassNameForDevToolsIcon(),showStrongNotification=this.hasStrongNotification()
devToolsIcon.className="dev-tools-icon "+recommendedClassName
devToolsIconStrongNotification.className=showStrongNotification?"strong-notification":""
if(showStrongNotification){var dataLastStrongNotification=Date.now()
devToolsIconStrongNotification.setAttribute("data-last-strong-notification",dataLastStrongNotification)
setTimeout((function(){if(dataLastStrongNotification===parseInt(devToolsIconStrongNotification.getAttribute("data-last-strong-notification"),10)){devToolsIconStrongNotification.removeAttribute("data-last-strong-notification")
devToolsIconStrongNotification.classList.remove("strong-notification")}}),1500)}}else{devToolsIcon.innerHTML=""
devToolsIcon.removeAttribute("title")
devToolsIcon.className="dev-tools-icon no-unread-messages"
devToolsIconStrongNotification.classList.remove("strong-notification")}}
ConsolePanel.prototype.flushLogsToUIAsync=function(){var that=this
requestAnimationFrame((function(){requestAnimationFrame((function(){that.flushLogsToUI()}))}))}
ConsolePanel.prototype.flushLogsToUI=function(){this.flushCountToIcon()
if(this.isConsolePanelVisible()){var shouldScrollToBottom=!1,logger=this.logger
logger.scrollHeight===logger.scrollTop+logger.offsetHeight&&(shouldScrollToBottom=!0)
for(var arrLogs=this.arrLogs;arrLogs.length;){var item=arrLogs.shift(),logMode=item.logMode,logEntry=item.logEntry,initiator=item.initiator,time=item.time,consoleMessageWrapper=document.createElement("div")
this.loggerBody.appendChild(consoleMessageWrapper)
consoleMessageWrapper.title="Logged at "+time.toTimeString().substring(0,8)
consoleMessageWrapper.className="dev-tools-console-message-wrapper "+("log"===logMode?"log-mode-log":"info"===logMode?"log-mode-info":"warn"===logMode?"log-mode-warn":"error"===logMode?"log-mode-error":"window.onerror"===logMode?"log-mode-window-onerror":"clear"===logMode?"log-mode-clear":"unhandled"===logMode?"log-mode-unhandled":"log-mode-unknown")
var divLogExecution=document.createElement("div")
consoleMessageWrapper.appendChild(divLogExecution)
divLogExecution.className="dev-tools-console-message-code-line"
divLogExecution.innerHTML=function(initiator){if(initiator.resourceLineCharacter){return'<a target="_blank" style="color:#545454; font-family:monospace;" href="'+sanitizeHTML(initiator.resourceUrl)+'" title="'+sanitizeHTML(initiator.resourceUrlLineCharacter)+'">'+sanitizeHTML(initiator.resourceLineCharacter)+"</a>"}return""}(initiator)
var span,consoleMessage=document.createElement("div")
consoleMessageWrapper.appendChild(consoleMessage)
consoleMessage.className="dev-tools-console-message"
if(0===logEntry.length){span=document.createElement("span")
consoleMessage.appendChild(span)
span.innerHTML=" "}else for(var i=0;i<logEntry.length;i++){if(i>0){var spacer=document.createElement("span")
consoleMessage.appendChild(spacer)
spacer.innerHTML=" "}span=document.createElement("span")
consoleMessage.appendChild(span)
!function(options){var className=options.className||"log-value-unknown",valueToLog=options.valueToLog,container=span
container.className=className
if("log-value-unknown"===className||"log-value-object"===className||"log-value-array"===className)if("undefined"==typeof JSONEditor){container.classList.add("jsoneditor-not-available")
Array.isArray(valueToLog)?sanitizedInnerHTML(container,String("["+valueToLog.length+"]")):sanitizedInnerHTML(container,"object"==typeof valueToLog?String("{"+Object.keys(valueToLog).length+"}"):String(typeof valueToLog)+" ("+String(valueToLog)+")")}else{var editor=new JSONEditor(container,{mode:"view",navigationBar:!1,search:!1,sortObjectKeys:!0})
editor.set(valueToLog)
editor.collapseAll()}else if("log-value-dom"===className){var firstLineOfValueToLog=valueToLog.split("\n")[0],hasMultilineHTML=!1
firstLineOfValueToLog!==valueToLog&&(hasMultilineHTML=!0)
var renderFullCode=function(){var spanFullCode=document.createElement("span")
container.appendChild(spanFullCode)
spanFullCode.className="all-lines-of-code"
spanFullCode.innerHTML='<pre><code class="language-markup">'+sanitizeHTML(valueToLog)+"</code></pre>"
"undefined"!=typeof Prism&&Prism.highlightAllUnder(spanFullCode)
return spanFullCode}
if(hasMultilineHTML){var spanFullCode,spanExpandCollapse=document.createElement("span")
container.appendChild(spanExpandCollapse)
spanExpandCollapse.className="console-panel-expand-collapse console-panel-collapsed"
var spanFirstLine=document.createElement("span")
container.appendChild(spanFirstLine)
spanFirstLine.className="only-first-line-of-code"
spanFirstLine.innerHTML='<pre><code class="language-markup">'+sanitizeHTML(firstLineOfValueToLog)+"</code></pre>"
"undefined"!=typeof Prism&&Prism.highlightAllUnder(spanFirstLine)
spanExpandCollapse.addEventListener("click",(function(evt){if(spanExpandCollapse.classList.contains("console-panel-collapsed")){spanFirstLine.style.display="none"
spanFullCode?spanFullCode.style.display="":spanFullCode=renderFullCode()}else{spanFirstLine.style.display=""
spanFullCode.style.display="none"}spanExpandCollapse.classList.toggle("console-panel-collapsed")
spanExpandCollapse.classList.toggle("console-panel-expanded")}))}else renderFullCode()}else container.innerHTML=String(valueToLog)}(logEntry[i])}if(["error","warn"].indexOf(logMode)>=0&&initiator.stack){var div=document.createElement("div")
consoleMessage.appendChild(div)
div.className="log-call-stack"
var initiatorStack=initiator.stack.split("\n")
initiatorStack.shift()
initiatorStack=initiatorStack.join("\n")
div.innerHTML=sanitizeHTML(initiatorStack)}}shouldScrollToBottom&&consoleMessageWrapper&&consoleMessageWrapper.scrollIntoView(!1)
this.flushCountToIcon()}}
ConsolePanel.prototype.logArrayEntry=function(options){var str,length,type=options.type||"unknown",initiator=options.initiator||{},value=options.value,className="log-value-unknown",valueToLog="not-handled"
if("boolean"===type){className="log-value-boolean"
valueToLog=value}else if("number"===type){className="log-value-number"
valueToLog=value}else if("string"===type){className="log-value-string"
valueToLog=sanitizeHTML((str=value.toString(),!(length=5003)||length<=3?str:str.length>length?str.substr(0,length-3)+"...":str))}else if("document.all"===type){className="log-value-document-all"
valueToLog=value}else if("undefined"===type){className="log-value-undefined"
valueToLog=value}else if("null"===type){className="log-value-null"
valueToLog=value}else if("function"===type){className="log-value-function"
valueToLog=value}else if("console.clear"===type){className="log-value-console-clear"
valueToLog=value}else if("dom"===type){className="log-value-dom"
valueToLog=value.outerHTML}else if("dom-text"===type){className="log-value-dom-text"
valueToLog=value.textContent}else if("window.onerror"===type){className="log-value-window-onerror"
var errorMessageToLog=function(){var strError="An error occurred",error=value.error
try{strError=error[4].stack}catch(e){try{strError=value.error[0]+"\n"+value.error[1]+":"+value.error[2]+(void 0===value.error[3]?"":":"+value.error[3])}catch(e){}}return strError}()
valueToLog=sanitizeHTML(errorMessageToLog)}else if("array"===type){className="log-value-array"
valueToLog=JSON.parse(CircularJSON.stringify(value,null,"","[Circular]"))}else if("object"===type){className="log-value-object"
valueToLog=JSON.parse(CircularJSON.stringify(value,null,"","[Circular]"))}else{className="log-value-unknown"
valueToLog=JSON.parse(CircularJSON.stringify(value,null,"","[Circular]"))}return{className:className,initiator:initiator,valueToLog:valueToLog}}
ConsolePanel.prototype.markLogEntry=function(logMode,args){for(var entryToPush=[],i=0;i<args.length;i++){var msg=args[i],logEntryType="unknown"
logEntryType="boolean"==typeof msg?"boolean":"function"==typeof msg?"function":"number"==typeof msg?"number":"string"==typeof msg?"string":"symbol"==typeof msg?"unknown":"object"==typeof msg?null===msg?"null":msg instanceof HTMLElement?"dom":msg instanceof Text?"dom-text":"window.onerror"===logMode?"window.onerror":Array.isArray(msg)?"array":"object":void 0===msg?msg===document.all?"document.all":"undefined":"unknown"
entryToPush.push(this.logArrayEntry({type:logEntryType,value:msg}))}var report={logMode:logMode,time:new Date,logEntry:entryToPush}
this.config.reportLogLines?report.initiator=getCurrentExecutionDetails("window.onerror"===logMode?{skipLevels:0,stack:(args[0].error[4]||{}).stack}:{skipLevels:5}):report.initiator={}
var that=this
that.arrLogs.push(report)
ready((function(){that.flushLogsToUIAsync()}))}
ConsolePanel.prototype.clear=function(){var reportLogLines=this.config.reportLogLines
this.arrLogs=[]
this.arrLogs.push({logMode:"clear",time:new Date,logEntry:[this.logArrayEntry({type:"console.clear",value:"Console was cleared"})],initiator:reportLogLines?getCurrentExecutionDetails({skipLevels:4}):{}})
this.loggerBody.innerHTML=""
this.flushLogsToUIAsync()}
ConsolePanel.prototype.setupIntercept=function(){var that=this,originals=that.originals,functionsToIntercept=that.config.functionsToIntercept,interceptIfRequired=function(type,original,cb){return"all"===functionsToIntercept||functionsToIntercept.indexOf(type)>=0?cb():original}
originals["window.onerror"]=interceptIfRequired("window.onerror",originals["window.onerror"],(function(){return after(window,"onerror",(function(){that.markLogEntry("window.onerror",[{error:arguments}])}))}))
originals["console.clear"]=after(varConsole,"clear",(function(){that.clear()}),console)
originals["console.log"]=interceptIfRequired("console.log",originals["console.log"],(function(){return after(varConsole,"log",(function(){that.markLogEntry("log",arguments)}),console)}))
originals["console.info"]=interceptIfRequired("console.info",originals["console.info"],(function(){return after(varConsole,"info",(function(){that.markLogEntry("info",arguments)}),console)}))
originals["console.warn"]=interceptIfRequired("console.warn",originals["console.warn"],(function(){return after(varConsole,"warn",(function(){that.markLogEntry("warn",arguments)}),console)}))
originals["console.error"]=interceptIfRequired("console.error",originals["console.error"],(function(){return after(varConsole,"error",(function(){that.markLogEntry("error",arguments)}),console)}))
Object.keys(varConsole).forEach((function(key){-1===["log","info","warn","error","clear"].indexOf(key)&&"function"==typeof varConsole[key]&&(originals["console."+key]=interceptIfRequired(key,originals["console."+key],(function(){return after(varConsole,key,(function(){that.markLogEntry("unhandled",arguments)}),console)})))}))}
ConsolePanel.prototype.render=function(){var that=this,consolePanelContainer=document.createElement("div")
consolePanelContainer.id="console-panel"
document.body.appendChild(consolePanelContainer)
var devToolsIconContainer=document.createElement("div")
this.devToolsIconContainer=devToolsIconContainer
consolePanelContainer.appendChild(devToolsIconContainer)
var devToolsIconStrongNotification=document.createElement("div")
this.devToolsIconStrongNotification=devToolsIconStrongNotification
devToolsIconContainer.appendChild(devToolsIconStrongNotification)
var devToolsIcon=document.createElement("div")
this.devToolsIcon=devToolsIcon
devToolsIcon.className="dev-tools-icon no-unread-messages"
devToolsIcon.addEventListener("click",(function(evt){that.showConsolePanel()
that.hideDevToolsIconContainer()}))
this.hideDevToolsIconContainer()
devToolsIconStrongNotification.appendChild(devToolsIcon)
var devTools=document.createElement("div")
this.devTools=devTools
consolePanelContainer.appendChild(devTools)
devTools.className="dev-tools"
this.hideConsolePanel()
devTools.style.height=function(){var height=parseInt(userPreference("consolePanelHeight"),10)
height>=0&&height<=1/0||(height=defaultUserPreference[getFullKey("consolePanelHeight")])
return height+"px"}()
var devToolsHeader=document.createElement("div")
devTools.appendChild(devToolsHeader)
devToolsHeader.className="dev-tools-header"
var consoleDragHandle=document.createElement("div")
devToolsHeader.appendChild(consoleDragHandle)
consoleDragHandle.className="dev-tools-resize-handle"
consoleDragHandle.innerHTML="&nbsp;"
var crossIcon=document.createElement("div")
devToolsHeader.appendChild(crossIcon)
crossIcon.title="Close"
crossIcon.className="dev-tools-header-cross-icon"
crossIcon.addEventListener("click",(function(evt){that.hideConsolePanel()
that.showDevToolsIconContainer()}))
var disableIcon=document.createElement("div")
that.disableIcon=disableIcon
disableIcon.title=constants_DISABLE_FOR_THIS_INSTANCE
disableIcon.className="dev-tools-header-disable-icon"
disableIcon.addEventListener("click",(function(evt){if(that.config&&"function"==typeof that.config.beforeDisableButtonClick){if(!1===that.config.beforeDisableButtonClick())return}that.hideConsolePanel()
that.disable()}))
devToolsHeader.appendChild(disableIcon)
var clearConsoleIcon=document.createElement("div")
devToolsHeader.appendChild(clearConsoleIcon)
clearConsoleIcon.title="Clear"
clearConsoleIcon.className="dev-tools-clear-console-icon"
clearConsoleIcon.addEventListener("click",(function(evt){that.clear()
console.clear()}))
var consoleTitle=document.createElement("div")
devToolsHeader.appendChild(consoleTitle)
consoleTitle.innerHTML="Console"
consoleTitle.style.cssFloat="left"
if($&&$.fn&&$.fn.resizable)try{var $devTools=$(".dev-tools")
if($.ui){consoleDragHandle.classList.add("ui-resizable-handle")
consoleDragHandle.classList.add("ui-resizable-n")
$devTools.resizable({handles:{n:$devTools.find(".dev-tools-resize-handle")},stop:function(evt,ui){userPreference("consolePanelHeight",ui.size.height)}})}else $devTools.resizable({handleSelector:".dev-tools-resize-handle",resizeWidth:!1,resizeHeightFrom:"top",onDragEnd:function(e,$el,opt){userPreference("consolePanelHeight",$el.outerHeight())}})
consoleDragHandle.style.cursor="n-resize"}catch(e){alertNote('Error in setting up "resize" for console-panel (<a target="_blank" href="https://github.com/webextensions/console-panel#full-featured-setup">Learn more</a>)',1e4)}var logger=document.createElement("div")
this.logger=logger
devTools.appendChild(logger)
logger.className="dev-tools-console"
var loggerHeader=document.createElement("div")
logger.appendChild(loggerHeader)
loggerHeader.className="dev-tools-console-header"
var loggerBody=document.createElement("div")
this.loggerBody=loggerBody
logger.appendChild(loggerBody)
loggerBody.className="dev-tools-console-body"
window.addEventListener("console-panel-devtoolschange",(function(e){that.config.doNotUseWhenDevToolsMightBeOpenInTab&&(e.detail.open?that.hideBecauseDevToolsIsOpen():that.showBecauseDevToolsIsClosed())}))
moduleGlobal.updateDevToolsStatus()}
ConsolePanel.prototype.enable=function(config){config=config||{}
var that=this
that.enabled&&that.disable()
var functionsToIntercept=Array.isArray(config.functionsToIntercept)?config.functionsToIntercept:"all",showOnlyForTheseRelevantMessages=config.showOnlyForTheseRelevantMessages||null,strongNotificationFor=config.strongNotificationFor||["window.onerror","console.error"],skipStrongNotificationIfNoStackTrace=config.skipStrongNotificationIfNoStackTrace||!1,reportLogLines=void 0===config.reportLogLines||!!config.reportLogLines,doNotUseWhenDevToolsMightBeOpenInTab=void 0!==config.doNotUseWhenDevToolsMightBeOpenInTab&&config.doNotUseWhenDevToolsMightBeOpenInTab,disableButtonTitle="string"==typeof config.disableButtonTitle&&""!==config.disableButtonTitle?config.disableButtonTitle:constants_DISABLE_FOR_THIS_INSTANCE,beforeDisableButtonClick=config.beforeDisableButtonClick,position=function(){switch(config.position){case"top-left":case"top-right":case"bottom-left":case"bottom-right":case"left-top":case"left-bottom":case"right-top":case"right-bottom":return config.position
default:return"bottom-right"}}()
!function(config){config.functionsToIntercept=functionsToIntercept
config.showOnlyForTheseRelevantMessages=showOnlyForTheseRelevantMessages
config.strongNotificationFor=strongNotificationFor
config.skipStrongNotificationIfNoStackTrace=skipStrongNotificationIfNoStackTrace
config.doNotUseWhenDevToolsMightBeOpenInTab=doNotUseWhenDevToolsMightBeOpenInTab
config.disableButtonTitle=disableButtonTitle
config.beforeDisableButtonClick=beforeDisableButtonClick
config.position=position}(that.config)
that.setupIntercept()
reportLogLines?that.enableReportLogLines():that.disableReportLogLines()
that.domReady||ready((function(){that.render()
that.domReady=!0}))
ready((function(){that.setButtonPosition(position)
that.disableIcon.title=disableButtonTitle
showOnlyForTheseRelevantMessages||that.config.doNotUseWhenDevToolsMightBeOpenInTab&&((devtoolsStatus=moduleGlobal.getDevToolsStatus())&&devtoolsStatus.open)||that.showDevToolsIconContainer()
var devtoolsStatus
that.flushLogsToUIAsync()}))
that.enabled=!0}
ConsolePanel.prototype.disable=function(){var that=this
window.onerror=that.originals["window.onerror"]
Object.keys(varConsole).forEach((function(key){that.originals["console."+key]&&(varConsole[key]=that.originals["console."+key])}))
that.enabled=!1}
ConsolePanel.prototype.enableReportLogLines=function(){this.config.reportLogLines=!0}
ConsolePanel.prototype.disableReportLogLines=function(){this.config.reportLogLines=!1}
return ConsolePanel}()
window.consolePanel=new ConsolePanel}}(window.jQuery)
