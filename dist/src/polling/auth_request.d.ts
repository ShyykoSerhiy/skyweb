import { CookieJar } from "request";
export declare class AuthRequest {
    private requestWithJar;
    constructor(cookieJar: CookieJar);
    pollAll: (skypeAccount: any, messagesCallback: any) => void;
}
export default AuthRequest;
