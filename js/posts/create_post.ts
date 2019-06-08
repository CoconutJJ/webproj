import * as tinymce from 'tinymce';
// A theme is also required
import 'tinymce/themes/silver';


document.addEventListener('DOMContentLoaded', function() {
    
    // run the tinymce editor
    tinymce.init({
        selector: "#post_editor",
        skin_url: '/lib/tinymce/skins/ui/oxide',

    })


})
