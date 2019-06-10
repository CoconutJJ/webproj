"use strict";
exports.__esModule = true;
var tinymce = require("tinymce");
// A theme is also required
require("tinymce/themes/silver");
var M = require("materialize-css");
document.addEventListener('DOMContentLoaded', function () {
    M.AutoInit();
    // run the tinymce editor
    tinymce.init({
        selector: "#post_editor",
        skin_url: '/lib/tinymce/skins/ui/oxide'
    });
    tinymce.get('post_editor').getContent();
});
