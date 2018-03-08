/// <reference types="request" />
import { CookieJar } from "request";
import { EventEmitter } from "../utils";
export declare class AuthRequest {
    private requestWithJar;
    private eventEmitter;
    constructor(cookieJar: CookieJar, eventEmitter: EventEmitter);
    pollAll(skypeAccount: any, messagesCallback: any): void;
}
export default AuthRequest;
