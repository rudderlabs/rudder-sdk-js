declare module "rudder-sdk-js" {
    function load(
        writeKey: string,
        dataPlaneUrl: string,
        options?: any
    ): any

    function ready (
        callback: any
    ): any

    function page(
        category?: string,
        name?: string,
        properties?: any,
        options?: any,
        callback?: any
    ): any;
    
    function track(
        event: string,
        properties?: any,
        options?: any,
        callback?: any
    ): any;

    function identify(
        id?: string,
        traits?: any,
        options?: any,
        callback?: any
    ): any;


    function alias(
        to: string,
        from?: string,
        options?: any,
        callback?: any
    ): any;

    function group(
        group: string,
        traits?: any,
        options?: any,
        callback?: any
    ): any;

    function getAnonymousId(): any;

    function setAnonymousId(
        id?: string
    ): any;

    function reset(): any

    export {
        load,
        ready,
        reset,
        page,
        track,
        identify,
        alias,
        group,
        setAnonymousId,
        getAnonymousId
    }        
}

