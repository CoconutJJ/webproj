import { HTTP, HTTP_METHOD } from '../definitions/HTTP';


class HTTPRequest<T = object> {


    private xhttp: XMLHttpRequest;
    private url: string;
    private method: HTTP_METHOD;

    /**
     *
     * @param method HTTP Request Method
     * @param url HTTP Request URL
     */
    constructor(method: HTTP_METHOD, url: string) {
        this.method = method;
        this.url = url;
        if (XMLHttpRequest) {
            this.xhttp = new XMLHttpRequest();
        } else {
            this.xhttp = new ActiveXObject('Microsoft.XMLHTTP');
        }
    }

    /**
     * Convert a JS associative array to a query string.
     * @param data
     */
    private toQueryString(data: object): string {
        var qstr = '';
        for (var key in data) {
            qstr += key + '=' + data[key] + '&';
        }

        return qstr.slice(0, -1);
    }

    public setHeader(header: string, value: string) {
        this.xhttp.setRequestHeader(header, value);
    }

    /**
     * Send the request off with payload DATA
     * @param DATA payload
     * @param requireStatus
     */
    private exec(DATA?: string | FormData, requireStatus?: number): Promise<T> {
        let req = this.xhttp;
        let method = this.method;
        let url = this.url;
        return new Promise(function (resolve, reject) {

        
            let csrf_meta: HTMLMetaElement = document.querySelector('meta[name=CSRF]');

            req.onreadystatechange = function () {

                if (req.readyState == XMLHttpRequest.DONE) {
                    if (req.getResponseHeader('CSRF-Token')) {
                        let csrf_meta: HTMLMetaElement = document.querySelector('meta[name=CSRF]');

                        csrf_meta.content = req.getResponseHeader('CSRF-Token');

                    }
                }

                // check if the AJAX is done and the correct HTTP Response 
                // status is returned
                if (req.readyState == XMLHttpRequest.DONE &&
                    req.status ==
                    ((requireStatus == null) ? HTTP.RESPONSE.OK :
                        requireStatus)) {

                    resolve(JSON.parse(req.responseText));


                } else if (req.readyState == XMLHttpRequest.DONE) {
                    // reject if done and status does not match required.
                    reject(JSON.parse(req.responseText));
                }



            };

            req.onerror = function (ev: ProgressEvent) {

                reject(req.status);
            };

            try {
                this.setHeader('CSRF-Token', csrf_meta.content);
                req.send(DATA);
            } catch (e) { }

        }.bind(this))
    }


    public execVoid(requireStatus?: number): Promise<T> {
        this.xhttp.open(this.method, this.url);
        return this.exec(null, requireStatus);
    }

    /**
     * Send the request off with a query string payload DATA
     * @param DATA JSON payload
     */
    public execAsQuery(DATA: object, requireStatus?: number): Promise<T> {

        this.xhttp.open(this.method, this.url);

        this.setHeader('Content-Type', 'application/x-www-form-urlencoded');


        return this.exec(this.toQueryString(DATA), requireStatus);
    }

    /**
     * Send the request off with a JSON payload DATA
     * @param DATA JSON payload
     */
    public execAsJSON(DATA: object, requireStatus?: number): Promise<T> {
        this.xhttp.open(this.method, this.url);
        this.setHeader('Content-Type', 'application/json')

        return this.exec(JSON.stringify(DATA), requireStatus);
    }

    public execAsFormData(DATA: { [key: string]: string | Blob }, FILES: { [key: string]: [File, (ev: ProgressEvent) => void] }, requireStatus?: number) {

        var formdata = new FormData();

        for (let key in DATA) {
            formdata.append(key, DATA[key])
        }

        for (let f in FILES) {
            formdata.append(f, FILES[f][0]);
        }


        this.xhttp.open(this.method, this.url);

        this.setHeader('Content-Type', 'multipart/form-data');

        return this.exec(formdata, requireStatus)
    }
}

export default HTTPRequest;