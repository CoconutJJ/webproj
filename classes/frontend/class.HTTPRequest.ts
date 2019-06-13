import {HTTP, HTTP_METHOD} from '../class.definitions';


class HTTPRequest<T=object> {
    

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
    private exec(DATA?: string, requireStatus?: number): Promise<T> {
        let req = this.xhttp;
        let method = this.method;
        let url = this.url;
        return new Promise(function (resolve, reject) {


            req.onreadystatechange = function () {

/*                 if (req.readyState == XMLHttpRequest.DONE) {

                    // get request must
                    if (method.toUpperCase() === "GET") {

                        let token = this.getResponseHeader('CSRF-Token');

                        if (token !== null) {
                            // update token
                            window['_token'] = token;

                            let csrf_metaTag: HTMLMetaElement = document.querySelector("meta[name='CSRF']");

                            if (csrf_metaTag == null) {
                                csrf_metaTag = document.createElement('meta');
                                csrf_metaTag.name = "CSRF";
                                document.head.appendChild(csrf_metaTag);
                            }
                            csrf_metaTag.content = token;
                        } else {
                            console.error("CSRF: No token was provided from GET " + url);
                        }
                    }



                } */

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
                this.setHeader('CSRF-Token', window['_token']);
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

        // collect browser data for potential usage.
        DATA['analytics'] = btoa(JSON.stringify({
            'creation_time': Date.now(),
            'cookies_enabled': navigator.cookieEnabled,
            'native_os': navigator.platform,
        }));

        return this.exec(this.toQueryString(DATA), requireStatus);
    }

    /**
     * Send the request off with a JSON payload DATA
     * @param DATA JSON payload
     */
    public execAsJSON(DATA: object, requireStatus?: number): Promise<T> {
        this.xhttp.open(this.method, this.url);
        this.setHeader('Content-Type', 'application/json')
        DATA['analytics'] = {
            'creation_time': Date.now(),
            'cookies_enabled': navigator.cookieEnabled,
            'native_os': navigator.platform,
        };
        return this.exec(JSON.stringify(DATA), requireStatus);
    }
}

export default HTTPRequest;