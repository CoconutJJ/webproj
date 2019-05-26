/**
 * @constructor
 */
class FileIO {
    private filename: string;

    private link: HTMLAnchorElement;

    private text: string;

    constructor(filename: string) {
        this.filename = filename;
        this.link = document.createElement("a");
        this.text = "";
    }
    
    static open(filename: string) {

        return new FileIO(filename);
    }

    public write(str: string) {
        this.text += str;
    }

    public download() {
        
        this.link.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(this.text));
        this.link.setAttribute("download", this.filename);
        this.link.style.display = "none";
        document.body.appendChild(this.link);
        this.link.click();
        document.body.removeChild(this.link);
    }
    
}