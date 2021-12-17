import SkypeAccount from './skype_account';
import { CookieJar } from "request";
import { Promise } from "es6-promise";
import { EventEmitter } from "./utils";
export interface Member {
    id: string;
    role: 'User' | 'Admin';
}
export declare class ThreadService {
    private requestWithJar;
    private eventEmitter;
    constructor(cookieJar: CookieJar, eventEmitter: EventEmitter);
    create(skypeAccount: SkypeAccount, members: Member[]): Promise<string>;
}
export default ThreadService;
