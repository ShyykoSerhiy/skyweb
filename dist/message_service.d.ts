import SkypeAccount = require('./skype_account');
import { CookieJar } from "request";
declare class MessageService {
    private requestWithJar;
    constructor(cookieJar: CookieJar);
    sendMessage(skypeAccount: SkypeAccount, conversationId: string, message: string, messagetype?: string, contenttype?: string): void;
}
export = MessageService;
