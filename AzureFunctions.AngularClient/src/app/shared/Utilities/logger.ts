import { Url } from "app/shared/Utilities/url";

export class Logger {
    static debugging: boolean = (Url.getParameterByName(null, "appsvc.log") === 'debug');
    static verboseDebugging: boolean = (Url.getParameterByName(null, "appsvc.log") === 'verbose');

    public static debug(obj: any) {
        if (this.debugging) {
            console.log(obj);
        }
    }

    public static verbose(obj: any) {
        if (this.verboseDebugging) {
            console.log(obj);
        }
    }
}