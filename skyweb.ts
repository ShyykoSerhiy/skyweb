import poll = require('./poll');
import SkypeAccount = require('./skype_account');
import messages = require('./message');
import ContactsService = require('./contacts_service');
import request = require('request');
import {CookieJar} from "request";
import Login = require("./login");
import Poll = require("./poll");

class Skyweb {
    public messagesCallback:(messages:Array<any>)=>void;
    public skypeAccount: SkypeAccount;
    public contactsService: ContactsService;
    /**
     * CookieJar that is used for this Skyweb instance
     */
    private cookieJar:CookieJar;
    
    constructor(){
        this.cookieJar = request.jar();
    }
    
    login(username, password):Promise<{}> {
        var me = this;
        this.skypeAccount = new SkypeAccount(username, password);
        this.contactsService = new ContactsService(this.cookieJar);
        
        return new Login(this.cookieJar).doLogin(this.skypeAccount).then((skypeAccount:SkypeAccount)=>{
            return new Promise(this.contactsService.loadContacts.bind(this.contactsService, skypeAccount));
        }).then((skypeAccount:SkypeAccount) => {
            new Poll(this.cookieJar).pollAll(skypeAccount, (messages:Array<any>)=> {
                if (me.messagesCallback){
                    me.messagesCallback(messages);
                }
            });
            return skypeAccount;
        });
    }
    
    sendMessage(conversationId:string, message:string){
        messages.sendMessage(this.skypeAccount, conversationId, message);
    }
}

export = Skyweb;
