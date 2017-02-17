import SkypeAccount from './skype_account';
import { CookieJar } from "request";
import { EventEmitter } from "./utils";
export declare class MessageService {
    private requestWithJar;
    private eventEmitter;
    constructor(cookieJar: CookieJar, eventEmitter: EventEmitter);
    sendMessage(skypeAccount: SkypeAccount, conversationId: string, message: string, messagetype?: string, contenttype?: string): void;
}
export default MessageService;
