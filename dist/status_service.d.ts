import SkypeAccount = require('./skype_account');
import { CookieJar } from "request";
import Status = require("./status/status");
declare class StatusService {
    private requestWithJar;
    constructor(cookieJar: CookieJar);
    setStatus(skypeAccount: SkypeAccount, status: Status): void;
}
export = StatusService;
