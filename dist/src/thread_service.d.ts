import SkypeAccount from './skype_account';
import { CookieJar } from "request";
import { Promise } from "es6-promise";
export interface Member {
    id: string;
    role: 'User' | 'Admin';
}
export declare class ThreadService {
    private requestWithJar;
    constructor(cookieJar: CookieJar);
    create(skypeAccount: SkypeAccount, members: Member[]): Promise<string>;
}
export default ThreadService;
