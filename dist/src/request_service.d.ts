/// <reference types="request" />
import { CookieJar } from "request";
import { EventEmitter } from "./utils";
export declare class RequestService {
    private requestWithJar;
    private eventEmitter;
    constructor(cookieJar: CookieJar, eventEmitter: EventEmitter);
    accept(skypeAccount: any, userName: any): void;
    decline(skypeAccount: any, userName: any): void;
}
export default RequestService;
