export class DataSanitizer {
    
    private rawVal: string;
    private sanitized: string;

    constructor(raw: string) {
        this.rawVal = raw;
        this.sanitized = raw;
    }

    public static DS(raw: string) {
        return new DataSanitizer(raw);
    }

    public escapeHTMLAngleBrackets(): DataSanitizer {

        this.sanitized = this.sanitized.replace(/</g, '&lt;').replace(/>/g, '&gt;');

        return this;
    }


    public val() {
        return this.sanitized;
    }

    public raw() {
        return this.rawVal;
    }
}




