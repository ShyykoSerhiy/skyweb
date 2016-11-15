import SkypeAccount from './skype_account';
import { CookieJar } from "request";
import { Promise } from "es6-promise";
export declare class ThreadService {
    private requestWithJar;
    constructor(cookieJar: CookieJar);
    create(skypeAccount: SkypeAccount, members?: any): Promise<any>;
}
export default ThreadService;
