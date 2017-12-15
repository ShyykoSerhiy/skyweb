import SkypeAccount from './skype_account';
import ContactsService from './contacts_service';
import * as request from 'request';
import { CookieJar } from "request";
import Login from "./login";
import Poll from "./polling/poll";
import MessageService from "./message_service";
import StatusService from "./status_service";
import AuthRequest from "./polling/auth_request";
import RequestService from "./request_service";
import ThreadService from "./thread_service";
import Status from "./status/status";
import { Promise } from "es6-promise";
import { Member } from "./thread_service";
import { EventEmitter } from "./utils";

class Skyweb {
    public messagesCallback: (messages: Array<any>) => void;
    public skypeAccount: SkypeAccount;
    public contactsService: ContactsService;
    private messageService: MessageService;
    private requestService: RequestService;
    private statusService: StatusService;
    private eventEmitter: EventEmitter;
    public threadService: ThreadService;
    /**
     * CookieJar that is used for this Skyweb instance
     */
    private cookieJar: CookieJar;

    constructor() {
        this.cookieJar = request.jar();
        this.eventEmitter = new EventEmitter();
        this.contactsService = new ContactsService(this.cookieJar, this.eventEmitter);
        this.messageService = new MessageService(this.cookieJar, this.eventEmitter);
        this.requestService = new RequestService(this.cookieJar, this.eventEmitter);
        this.statusService = new StatusService(this.cookieJar, this.eventEmitter);
        this.requestService = new RequestService(this.cookieJar, this.eventEmitter);
        this.threadService = new ThreadService(this.cookieJar, this.eventEmitter);
    }

    login(username: any, password: any): Promise<{}> {
        this.skypeAccount = new SkypeAccount(username, password);
        return new Login(this.cookieJar, this.eventEmitter).doLogin(this.skypeAccount).then((skypeAccount: SkypeAccount) => {
            return new Promise(this.contactsService.loadContacts.bind(this.contactsService, skypeAccount));
        }).then((skypeAccount: SkypeAccount) => {
            new Poll(this.cookieJar, this.eventEmitter).pollAll(skypeAccount, (messages: Array<any>) => {
                if (this.messagesCallback) {
                    this.messagesCallback(messages);
                }
            });
            return skypeAccount;
        });
    }

    sendMessage(conversationId: string, message: string, messagetype?: string, contenttype?: string) {
        this.messageService.sendMessage(this.skypeAccount, conversationId, message, messagetype, contenttype);
    }
	
	setTopic(conversationId: string, message: string) {
		this.messageService.setTopic(this.skypeAccount, conversationId, message);
    }
    setStatus(status: Status) {
        this.statusService.setStatus(this.skypeAccount, status);
    }

    acceptAuthRequest(username: any) {
        return this.requestService.accept(this.skypeAccount, username);
    }

    declineAuthRequest(username: any) {
        return this.requestService.decline(this.skypeAccount, username);
    }

    createThread(members: Member[]): Promise<string> {
        return this.threadService.create(this.skypeAccount, members);
    }

    on(eventName: string, listener: (eventName: string, content: any) => void) {
        this.eventEmitter.on(eventName, listener);
    }

    un(eventName: string, listener: (eventName: string, content: any) => void) {
        this.eventEmitter.un(eventName, listener);
    }
}

export = Skyweb;
