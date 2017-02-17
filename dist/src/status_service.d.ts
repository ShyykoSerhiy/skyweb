import SkypeAccount from './skype_account';
import { CookieJar } from "request";
import Status from "./status/status";
import { EventEmitter } from "./utils";
export declare class StatusService {
    private requestWithJar;
    private eventEmitter;
    constructor(cookieJar: CookieJar, eventEmitter: EventEmitter);
    setStatus(skypeAccount: SkypeAccount, status: Status): void;
}
export default StatusService;
