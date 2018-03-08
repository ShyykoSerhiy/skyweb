/// <reference types="request" />
import SkypeAccount from './skype_account';
import { CookieJar } from "request";
import { Promise } from "es6-promise";
import { EventEmitter } from "./utils";
export declare class Login {
    private requestWithJar;
    private cookieJar;
    private eventEmitter;
    constructor(cookieJar: CookieJar, eventEmitter: EventEmitter);
    doLogin(skypeAccount: SkypeAccount): Promise<{}>;
    private sendLoginRequestOauth(skypeAccount, resolve, reject);
    private promiseSkypeToken(skypeAccount, magicT);
    private getRegistrationToken(skypeAccount, resolve, reject);
    private subscribeToResources(skypeAccount, resolve, reject);
    private createStatusEndpoint(skypeAccount, resolve, reject);
    private getSelfDisplayName(skypeAccout, resolve, reject);
}
export default Login;
