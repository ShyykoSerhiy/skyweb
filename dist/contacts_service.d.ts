import SkypeAccount = require('./skype_account');
import { CookieJar } from "request";
declare class ContactsService {
    contacts: Array<{}>;
    private requestWithJar;
    constructor(cookieJar: CookieJar);
    loadContacts(skypeAccount: SkypeAccount, resolve: (skypeAccount: SkypeAccount, contacts: Array<{}>) => {}, reject: any): void;
}
export = ContactsService;
