class SignalEvents<T> {

    private eventName: string

    constructor (eventName: string) {
        this.eventName = eventName;
    }

    public static subscribe<T>(eventName: string, onTrigger: (data: T) => void) {
        window.addEventListener(eventName, function (evt: CustomEvent) {
            onTrigger(evt.detail);
        })
    }
    
    public dispatch(data: T) {
        let customEvent = new CustomEvent(this.eventName, {detail: data})

        window.dispatchEvent(customEvent);
    }    

}