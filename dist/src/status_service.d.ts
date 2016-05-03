import SkypeAccount from './skype_account';
import { CookieJar } from "request";
import Status from "./status/status";
export declare class StatusService {
    private requestWithJar;
    constructor(cookieJar: CookieJar);
    setStatus(skypeAccount: SkypeAccount, status: Status): void;
}
export default StatusService;
