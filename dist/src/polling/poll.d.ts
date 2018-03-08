/// <reference types="request" />
import SkypeAccount from './../skype_account';
import { CookieJar } from "request";
import { EventEmitter } from "../utils";
export declare class Poll {
    private requestWithJar;
    private cookieJar;
    private eventEmitter;
    constructor(cookieJar: CookieJar, eventEmitter: EventEmitter);
    pollAll(skypeAccount: SkypeAccount, messagesCallback: (messages: Array<any>) => void): void;
    private static parsePollResult(pollResult, messagesCallback);
}
export default Poll;
