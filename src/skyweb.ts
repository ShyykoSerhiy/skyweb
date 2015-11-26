/// <reference path='../typings/tsd.d.ts' />
import poll = require('./polling/poll');
import SkypeAccount = require('./skype_account');
import ContactsService = require('./contacts_service');
import request = require('request');
import {CookieJar} from "request";
import Login = require("./login");
import Poll = require("./polling/poll");
import MessageService = require("./message");
import AuthRequest = require("./polling/auth_request");
import RequestService = require("./request_service");
import {Promise} from "es6-promise";

class Skyweb {
    public messagesCallback:(messages:Array<any>)=>void;
    public authRequestCallback:(messages:Array<any>)=>void;
    public skypeAccount:SkypeAccount;
    public contactsService:ContactsService;
    private messageService:MessageService;
    private requestService:RequestService;
    /**
     * CookieJar that is used for this Skyweb instance
     */
    private cookieJar:CookieJar;

    constructor() {
        this.cookieJar = request.jar();
        this.contactsService = new ContactsService(this.cookieJar);
        this.messageService = new MessageService(this.cookieJar);
        this.requestService = new RequestService(this.cookieJar);
    }

    login(username, password):Promise<{}> {
        this.skypeAccount = new SkypeAccount(username, password);
        return new Login(this.cookieJar).doLogin(this.skypeAccount).then((skypeAccount:SkypeAccount)=> {
            return new Promise(this.contactsService.loadContacts.bind(this.contactsService, skypeAccount));
        }).then((skypeAccount:SkypeAccount) => {
            new Poll(this.cookieJar).pollAll(skypeAccount, (messages:Array<any>)=> {
                if (this.messagesCallback) {
                    this.messagesCallback(messages);
                }
            });
            new AuthRequest(this.cookieJar).pollAll(skypeAccount, (requestData) => {
                if (this.authRequestCallback) {
                    this.authRequestCallback(requestData);
                }
            });
            return skypeAccount;
        });
    }

    sendMessage(conversationId:string, message:string, messagetype?:string, contenttype?:string) {
        this.messageService.sendMessage(this.skypeAccount, conversationId, message, messagetype, contenttype);
    }

    acceptAuthRequest(username) {
        return this.requestService.accept(this.skypeAccount, username);
    }

    declineAuthRequest(username) {
        return this.requestService.decline(this.skypeAccount, username);
    }
}

export = Skyweb;
