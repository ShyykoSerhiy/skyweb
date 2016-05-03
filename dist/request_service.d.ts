import { CookieJar } from "request";
declare class RequestService {
    private requestWithJar;
    constructor(cookieJar: CookieJar);
    accept(skypeAccount: any, userName: any): void;
    decline(skypeAccount: any, userName: any): void;
}
export = RequestService;
