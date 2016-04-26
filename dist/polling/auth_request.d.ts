import { CookieJar } from "request";
declare class AuthRequest {
    private requestWithJar;
    constructor(cookieJar: CookieJar);
    pollAll: (skypeAccount: any, messagesCallback: any) => void;
}
export = AuthRequest;
