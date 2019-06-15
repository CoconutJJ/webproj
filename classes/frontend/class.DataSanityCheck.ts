class DataSanityCheck {

    public static containsHTMLTags(...str: string[]): boolean {
        for (let i = 0; i < str.length; i++) {
            if (str[i] === null) {
                continue;
            }
            if (str[i].match(/<(.*)>/) != null) {
                return false;
            }
        }
        return true;
    }

    public static isEmpty(...str: string[]): boolean {
        for (let i = 0; i < str.length; i++) {
            if (str[i] === null || str[i].match(/\s+$/g) || str[i].length == 0) {
                return false;
            }
        }
        return true;
    }
    

}

export default DataSanityCheck;