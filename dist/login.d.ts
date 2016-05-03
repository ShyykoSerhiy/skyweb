import SkypeAccount = require('./skype_account');
import { CookieJar } from "request";
declare class Login {
    private requestWithJar;
    constructor(cookieJar: CookieJar);
    doLogin(skypeAccount: SkypeAccount): Promise<{}>;
    private sendLoginRequest(skypeAccount, resolve, reject);
    private getRegistrationToken(skypeAccount, resolve, reject);
    private subscribeToResources(skypeAccount, resolve, reject);
    private createStatusEndpoint(skypeAccount, resolve, reject);
    private getSelfDisplayName(skypeAccout, resolve, reject);
}
export = Login;
