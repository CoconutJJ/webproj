"use strict";
exports.__esModule = true;
var tinymce = require("tinymce");
// A theme is also required
require("tinymce/themes/silver");
document.addEventListener('DOMContentLoaded', function () {
    // run the tinymce editor
    tinymce.init({
        selector: "#post_editor",
        skin_url: '/lib/tinymce/skins/ui/oxide'
    });
});
