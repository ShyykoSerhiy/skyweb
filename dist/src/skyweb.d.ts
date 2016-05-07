import SkypeAccount from './skype_account';
import ContactsService from './contacts_service';
import Status from "./status/status";
import { Promise } from "es6-promise";
export declare class Skyweb {
    messagesCallback: (messages: Array<any>) => void;
    authRequestCallback: (messages: Array<any>) => void;
    skypeAccount: SkypeAccount;
    contactsService: ContactsService;
    private messageService;
    private requestService;
    private statusService;
    private cookieJar;
    constructor();
    login(username: any, password: any): Promise<{}>;
    sendMessage(conversationId: string, message: string, messagetype?: string, contenttype?: string): void;
    setStatus(status: Status): void;
    acceptAuthRequest(username: any): void;
    declineAuthRequest(username: any): void;
}
export default Skyweb;
