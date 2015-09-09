/// <reference path='./typings/node/node.d.ts' />
/// <reference path='./typings/request/request.d.ts' />
import request = require('request');
import Consts = require('./consts');
import SkypeAccount = require('./skype_account');
import Utils = require('./utils');
import http = require('http');
'use strict';

class ContactsService {
    public contacts:Array<{}>;

    public loadContacts(skypeAccount:SkypeAccount, resolve:(skypeAccount:SkypeAccount, contacts:Array<{}>)=>{}, reject):void {
        request.get(Consts.SKYPEWEB_HTTPS + Consts.SKYPEWEB_CONTACTS_HOST + '/contacts/v1/users/' + skypeAccount.selfInfo.username + '/contacts', {
            headers: {
                'X-Skypetoken': skypeAccount.skypeToken
            }
        }, (error:any, response:http.IncomingMessage, body:any) => {
            if (!error && response.statusCode === 200) {
                this.contacts = JSON.parse(body).contacts;
                resolve(skypeAccount, this.contacts);
            } else {
                Utils.throwError('Failed to load contacts.');
            }
        });
    }
}

export = ContactsService;


