// ==UserScript==
// @name         Wide JIRA
// @namespace    https://greasyfork.org/users/206706
// @license      MIT
// @version      1.0.18
// @description  Widen your create issue box in JIRA
// @author       Fishswing, Gemini
// @include      http://jira.*
// @include      https://jira.*
// @include      http://*/jira/*
// @include      https://*/jira/*
// @grant        GM_addStyle
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    // 1. CSS Style Fixes
    const css = `
    /* =========================================
       1. Optimization for main business dialogs (Create/Edit/Link/Sub-task)
       [v1.0.17] Rollback to v1.0.13 logic, removed complex scroll/Form fixes
       ========================================= */
    section#create-issue-dialog,
    section#edit-issue-dialog,
    section#link-issue-dialog,
    section#clone-issue-dialog,
    section#workflow-transition-view-dialog,
    section#create-subtask-dialog {
        width: 80vw !important;
        left: 10vw !important;
        top: 5vh !important;
        height: 90vh !important;
        margin-left: 0 !important;
        margin-top: 0 !important;
    }

    section#create-issue-dialog .aui-dialog2-content,
    section#edit-issue-dialog .aui-dialog2-content,
    section#link-issue-dialog .aui-dialog2-content,
    section#clone-issue-dialog .aui-dialog2-content,
    section#workflow-transition-view-dialog .aui-dialog2-content,
    section#create-subtask-dialog .aui-dialog2-content {
        position: absolute !important;
        top: 60px !important;
        bottom: 55px !important;
        left: 0 !important;
        right: 0 !important;
        width: 100% !important;

        /* Restore height: auto from v1.0.13, allowing content to expand naturally */
        height: auto !important;
        max-height: none !important;

        overflow-y: auto !important;
        /* Prevent horizontal scrollbar when Summary is too wide */
        overflow-x: hidden !important;
        box-sizing: border-box !important;
        background-color: #fff !important;
    }

    section#create-issue-dialog .aui-dialog2-header,
    section#edit-issue-dialog .aui-dialog2-header,
    section#link-issue-dialog .aui-dialog2-header,
    section#clone-issue-dialog .aui-dialog2-header,
    section#workflow-transition-view-dialog .aui-dialog2-header,
    section#create-subtask-dialog .aui-dialog2-header {
        position: absolute !important;
        top: 0;
        width: 100%;
        height: 60px !important;
        z-index: 10;
    }

    section#create-issue-dialog .aui-dialog2-footer,
    section#edit-issue-dialog .aui-dialog2-footer,
    section#link-issue-dialog .aui-dialog2-footer,
    section#clone-issue-dialog .aui-dialog2-footer,
    section#workflow-transition-view-dialog .aui-dialog2-footer,
    section#create-subtask-dialog .aui-dialog2-footer {
        position: absolute !important;
        bottom: 0;
        width: 100%;
        height: 55px !important;
        z-index: 10;
    }

    /* =========================================
       2. Fixes for Attachment Dialog
       ========================================= */
    body.aui-page-focused .aui-dialog2[id*="attach"],
    body.aui-page-focused .aui-dialog2[id*="upload"] {
        position: fixed !important;
        width: 60vw !important;
        height: 70vh !important;
        top: 50% !important;
        left: 50% !important;
        margin-left: -30vw !important;
        margin-top: -35vh !important;
        margin-bottom: 0 !important;
        margin-right: 0 !important;
        transform: none !important;
        max-height: 90vh !important;
        z-index: 99999 !important;
        background: #fff !important;
        box-shadow: 0 0 30px rgba(0,0,0,0.5) !important;
        border: 1px solid #ccc !important;
    }

    body.aui-page-focused .aui-dialog2[id*="attach"] .aui-dialog2-content,
    body.aui-page-focused .aui-dialog2[id*="upload"] .aui-dialog2-content {
        position: absolute !important;
        top: 60px !important;
        bottom: 60px !important;
        left: 0 !important;
        right: 0 !important;
        width: 100% !important;
        height: auto !important;
        max-height: none !important;
        overflow-y: auto !important;
        box-sizing: border-box !important;
        padding: 20px !important;
    }

    body.aui-page-focused .aui-dialog2[id*="attach"] .aui-dialog2-header,
    body.aui-page-focused .aui-dialog2[id*="upload"] .aui-dialog2-header {
        position: absolute !important;
        top: 0 !important;
        left: 0 !important;
        width: 100% !important;
        height: 60px !important;
        z-index: 20 !important;
        border-bottom: 1px solid #ddd !important;
    }

    body.aui-page-focused .aui-dialog2[id*="attach"] .aui-dialog2-footer,
    body.aui-page-focused .aui-dialog2[id*="upload"] .aui-dialog2-footer {
        position: absolute !important;
        bottom: 0 !important;
        left: 0 !important;
        width: 100% !important;
        height: 60px !important;
        z-index: 20 !important;
        border-top: 1px solid #ddd !important;
        background-color: #f4f5f7 !important;
    }

    /* =========================================
       3. Fix Wiki editor attachment dropdown menu (Keep long filename fix from v1.0.14)
       ========================================= */
    body.aui-page-focused .wiki-edit-dropdown-attachment {
        position: fixed !important;
        top: 50% !important;
        left: 50% !important;
        transform: translate(-50%, -50%) !important;
        height: auto !important;
        min-height: 150px !important;

        /* Width optimization for long filenames */
        min-width: 320px !important;
        max-width: 600px !important;
        width: auto !important;

        z-index: 100000 !important;
        background: #fff !important;
        border: 1px solid #ccc !important;
        box-shadow: 0 10px 40px rgba(0,0,0,0.5) !important;
        border-radius: 4px !important;
        padding: 10px !important;
        margin: 0 !important;
    }

    body.aui-page-focused .wiki-edit-dropdown-attachment * {
        max-height: none !important;
        overflow: visible !important;
    }

    body.aui-page-focused .wiki-edit-dropdown-attachment li,
    body.aui-page-focused .wiki-edit-dropdown-attachment a,
    body.aui-page-focused .wiki-edit-dropdown-attachment div {
        display: block !important;
        visibility: visible !important;
        opacity: 1 !important;
    }

    /* Force line break for long filenames */
    body.aui-page-focused .wiki-edit-dropdown-attachment li a {
        white-space: normal !important;
        word-break: break-all !important;
        overflow-wrap: break-word !important;
        line-height: 1.4 !important;
        padding: 5px !important;
    }

    body.aui-page-focused .wiki-edit-toolbar .wiki-edit-attachment-picker-trigger {
        display: inline-block !important;
        visibility: visible !important;
        opacity: 1 !important;
        z-index: 100 !important;
    }

    /* =========================================
       4. Optimization for Standalone Page mode
       ========================================= */
    .aui-page-focused-large .aui-page-panel {
        width: 90% !important;
        max-width: none !important;
    }

    .aui-page-focused-large .aui-page-header {
        width: 90% !important;
        max-width: none !important;
        margin-left: auto !important;
        margin-right: auto !important;
    }

    /* =========================================
       5. Editor height and adjustments (The Editor)
       ========================================= */
    .jira-editor-container,
    .jira-wikifield {
        max-height: none !important;
    }

    textarea#description {
        min-height: 50vh !important;
        height: auto !important;
        max-height: none !important;
        box-sizing: border-box !important;
    }

    textarea.textarea.long-field {
        min-height: 200px !important;
        max-height: none !important;
    }

    .mce-edit-area iframe {
        min-height: 50vh !important;
    }

    /* =========================================
       6. Summary box width adjustment
       ========================================= */
    input#summary {
        max-width: none !important;
        width: 100% !important;
        box-sizing: border-box !important;
    }
    `;

    if (typeof GM_addStyle !== "undefined") {
        GM_addStyle(css);
    } else {
        let styleNode = document.createElement("style");
        styleNode.appendChild(document.createTextNode(css));
        (document.querySelector("head") || document.documentElement).appendChild(styleNode);
    }

    // 2. JavaScript Logic Fixes (Fix Browse button click)
    // Resolve the issue where the "Browse" button is unclickable in standalone page mode
    function fixBrowseClick() {
        document.addEventListener('click', function(e) {
            const target = e.target;
            const isBrowseLink = target.classList.contains('wiki-attachment-browse') ||
                                 target.innerText.trim() === 'Browse';

            if (isBrowseLink) {
                console.log("Wide JIRA: Intercepted click on Browse button.");
                const fileInput = document.querySelector('input[type="file"][name="file"]') ||
                                  document.querySelector('input[type="file"]');

                if (fileInput) {
                    console.log("Wide JIRA: Found file input, triggering click manually.");
                    e.preventDefault();
                    e.stopPropagation();
                    fileInput.click();
                } else {
                    console.error("Wide JIRA: Could not find any file input on the page!");
                }
            }
        }, true);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', fixBrowseClick);
    } else {
        fixBrowseClick();
    }

})();
