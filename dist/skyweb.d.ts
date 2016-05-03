import SkypeAccount = require('./skype_account');
import ContactsService = require('./contacts_service');
import Status = require("./status/status");
declare class Skyweb {
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
export = Skyweb;
