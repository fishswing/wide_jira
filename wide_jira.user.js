// ==UserScript==
// @name Wide JIRA
// @description Widen your create issue box in JIRA
// @author Fishswing
// @namespace https://greasyfork.org/users/206706
// @license MIT
// @version 0.0.2
// @grant GM_addStyle
// @run-at document-start
// @include http://jira.*
// @include https://jira.*
// ==/UserScript==

(function() {
let css = `

.aui-dialog2-large {
    width: 80% !important;
    top: 3% !important;
    bottom: 3% !important;
}

.aui-dialog2-content {
    max-height: 100% !important;
}

.aui-page-focused-large .aui-page-panel {
    width: 80% !important;
}

.aui-page-focused-large .aui-page-header {
    width: 80% !important;
}

`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  let styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
