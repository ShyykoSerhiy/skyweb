import SkypeAccount from './../skype_account';
import { CookieJar } from "request";
export declare class Poll {
    private requestWithJar;
    constructor(cookieJar: CookieJar);
    pollAll(skypeAccount: SkypeAccount, messagesCallback: (messages: Array<any>) => void): void;
    private static parsePollResult(pollResult, messagesCallback);
}
export default Poll;
