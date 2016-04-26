import SkypeAccount from './skype_account';
import { CookieJar } from "request";
export declare class ContactsService {
    contacts: Array<{}>;
    private requestWithJar;
    constructor(cookieJar: CookieJar);
    loadContacts(skypeAccount: SkypeAccount, resolve: (skypeAccount: SkypeAccount, contacts: Array<{}>) => {}, reject: any): void;
}
export default ContactsService;
