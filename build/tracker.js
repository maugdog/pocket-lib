module.exports=function(e){var t={};function n(i){if(t[i])return t[i].exports;var a=t[i]={i:i,l:!1,exports:{}};return e[i].call(a.exports,a,a.exports,n),a.l=!0,a.exports}return n.m=e,n.c=t,n.d=function(e,t,i){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:i})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var i=Object.create(null);if(n.r(i),Object.defineProperty(i,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var a in e)n.d(i,a,function(t){return e[t]}.bind(null,a));return i},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=0)}([function(e,t,n){"use strict";function i(e,t){for(var n=0;n<t.length;n++){var i=t[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}n.r(t),n.d(t,"Tracker",(function(){return a})),n.d(t,"tracker",(function(){return s}));var a=function(){function e(t){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e),this.debug=!1,this.queue=[],this.timeout=null,this.syncInterval=1e3,this.isSyncing=!1,this.sendToCustomService=t&&t.sendToCustomService,this.interval=null,this.blacklisted=t&&t.blacklisted||!1,this.sync=this.sync.bind(this)}var t,n,a;return t=e,(n=[{key:"logMessage",value:function(e){if(this.debug){for(var t,n=arguments.length,i=new Array(n>1?n-1:0),a=1;a<n;a++)i[a-1]=arguments[a];(t=console).log.apply(t,[e].concat(i))}}},{key:"start",value:function(){this.interval=setInterval(this.sync,this.syncInterval)}},{key:"stop",value:function(){this.interval&&clearInterval(this.interval)}},{key:"send",value:function(e,t){var n=this;this.sendToCustomService&&!this.blacklisted?(this.isSyncing=!0,this.logMessage("Tracker is sending batch:",e),this.sendToCustomService(e).then((function(e){n.isSyncing=!1,t&&t()})).catch((function(e){n.isSyncing=!1,t&&t(e)}))):this.logMessage("Tracker is blacklisted")}},{key:"sync",value:function(){var e=this;if(!this.isSyncing&&this.queue.length){var t=this.queue;this.queue=[],this.send(t,(function(n){n&&(e.queue=e.queue.concat(t))}))}}},{key:"identify",value:function(e){e&&e.id&&!this.blacklisted&&("undefined"!=typeof mixpanel&&mixpanel.identify(e.id),this.logMessage("Tracking identification: ".concat(e.id)))}},{key:"track",value:function(e,t){this.blacklisted?this.logMessage("Tracker is blacklisted"):(this.queue.push({name:e,data:t}),"undefined"!=typeof ga&&ga("send","event","Site",e),"undefined"!=typeof mixpanel&&mixpanel.track(e,t),this.logMessage('Tracking event: "'.concat(e,'" with data: '),t))}},{key:"page",value:function(e){this.blacklisted?this.logMessage("Tracker is blacklisted"):(this.queue.push({name:"$page",data:{url:e}}),"undefined"!=typeof ga&&(ga("set","page",e),ga("send","pageview")),"undefined"!=typeof mixpanel&&mixpanel.track("Page View",{url:e}),this.logMessage('Tracking "$page" event: '.concat(e)))}}])&&i(t.prototype,n),a&&i(t,a),e}(),s=new a;t.default=s}]);