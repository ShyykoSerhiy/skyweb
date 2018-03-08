/// <reference types="request" />
import SkypeAccount from './skype_account';
import { CookieJar } from "request";
import { EventEmitter } from "./utils";
export declare class ContactsService {
    contacts: Array<{}>;
    private requestWithJar;
    private eventEmitter;
    constructor(cookieJar: CookieJar, eventEmitter: EventEmitter);
    loadContacts(skypeAccount: SkypeAccount, resolve: (skypeAccount: SkypeAccount, contacts: Array<{}>) => {}, reject: any): void;
}
export default ContactsService;
