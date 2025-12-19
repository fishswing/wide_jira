// ==UserScript==
// @name         Wide JIRA
// @namespace    https://greasyfork.org/users/206706
// @license      MIT
// @version      1.0.11
// @description  Widen your create issue box in JIRA
// @author       Fishswing (Enhanced by Gemini)
// @include      http://jira.*
// @include      https://jira.*
// @include      http://*/jira/*
// @include      https://*/jira/*
// @grant        GM_addStyle
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    // 1. CSS 样式修复 (保持 v1.0.10 的所有 CSS 修复)
    const css = `
    /* =========================================
       1. 针对主业务弹窗 (Create/Edit/Link) 的优化
       ========================================= */
    section#create-issue-dialog,
    section#edit-issue-dialog,
    section#link-issue-dialog,
    section#clone-issue-dialog,
    section#workflow-transition-view-dialog {
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
    section#workflow-transition-view-dialog .aui-dialog2-content {
        position: absolute !important;
        top: 60px !important;
        bottom: 55px !important;
        left: 0 !important;
        right: 0 !important;
        width: 100% !important;
        height: auto !important;
        max-height: none !important;
        overflow-y: auto !important;
        box-sizing: border-box !important;
        background-color: #fff !important;
    }

    section#create-issue-dialog .aui-dialog2-header,
    section#edit-issue-dialog .aui-dialog2-header,
    section#link-issue-dialog .aui-dialog2-header,
    section#clone-issue-dialog .aui-dialog2-header,
    section#workflow-transition-view-dialog .aui-dialog2-header {
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
    section#workflow-transition-view-dialog .aui-dialog2-footer {
        position: absolute !important;
        bottom: 0;
        width: 100%;
        height: 55px !important;
        z-index: 10;
    }

    /* =========================================
       2. 针对附件弹窗 (Attachment Dialog) 的修复
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
       3. 修复 Wiki 编辑器附件下拉菜单
       ========================================= */
    body.aui-page-focused .wiki-edit-dropdown-attachment {
        position: fixed !important;
        top: 50% !important;
        left: 50% !important;
        transform: translate(-50%, -50%) !important;
        height: auto !important;
        min-height: 150px !important;
        width: 320px !important;
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

    body.aui-page-focused .wiki-edit-toolbar .wiki-edit-attachment-picker-trigger {
        display: inline-block !important;
        visibility: visible !important;
        opacity: 1 !important;
        z-index: 100 !important;
    }

    /* =========================================
       4. 针对独立页面模式 (Standalone Page) 的优化
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
       5. 编辑器高度与调整 (The Editor)
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
    `;

    if (typeof GM_addStyle !== "undefined") {
        GM_addStyle(css);
    } else {
        let styleNode = document.createElement("style");
        styleNode.appendChild(document.createTextNode(css));
        (document.querySelector("head") || document.documentElement).appendChild(styleNode);
    }

    // 2. JavaScript 逻辑修复 (v1.0.11 新增)
    // 解决 "Browse" 按钮在独立页面模式下点击无效的问题
    // 由于 JIRA 的上传 input 组件位置错乱，我们通过 JS 拦截点击并手动转发给 input
    function fixBrowseClick() {
        document.addEventListener('click', function(e) {
            // 检查点击的是否是 "Browse" 链接 (通常包含 .wiki-attachment-browse 类或文本)
            const target = e.target;
            const isBrowseLink = target.classList.contains('wiki-attachment-browse') ||
                                 target.innerText.trim() === 'Browse';

            if (isBrowseLink) {
                console.log("Wide JIRA: Intercepted click on Browse button.");

                // 查找页面上的文件输入框
                // 优先查找 name="file" 的输入框，或者任意 file input
                const fileInput = document.querySelector('input[type="file"][name="file"]') ||
                                  document.querySelector('input[type="file"]');

                if (fileInput) {
                    console.log("Wide JIRA: Found file input, triggering click manually.");
                    // 阻止默认行为（防止 JIRA 某些报错）
                    e.preventDefault();
                    e.stopPropagation();

                    // 手动触发文件选择框
                    fileInput.click();
                } else {
                    console.error("Wide JIRA: Could not find any file input on the page!");
                }
            }
        }, true); // 使用捕获模式(true)以确保在 JIRA 自己的事件之前执行
    }

    // 立即运行修复逻辑，或者等待 DOM Ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', fixBrowseClick);
    } else {
        fixBrowseClick();
    }

})();
