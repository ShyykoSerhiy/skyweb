import request = require('request');
import Consts = require('./consts');
import SkypeAccount = require('./skype_account');
import Utils = require('./utils');
import http = require('http');
import {CookieJar} from "request";
'use strict';

class MessageService {
    private requestWithJar;

    constructor(cookieJar:CookieJar) {
        this.requestWithJar = request.defaults({jar: cookieJar});
    }

    public sendMessage(skypeAccount:SkypeAccount, conversationId:string, message:string, messagetype?:string, contenttype?:string) {
        var requestBody = JSON.stringify({
            ///'clientmessageid': Utils.getCurrentTime() + '', //fixme looks like we don't need this?(at least if we don't want to
            // have the ability to modify text(content) of the message.)
            'content': message,
            'messagetype': messagetype || 'RichText',
            'contenttype': contenttype || 'text'
        });
        this.requestWithJar.post(Consts.SKYPEWEB_HTTPS + skypeAccount.messagesHost + '/v1/users/ME/conversations/' + conversationId + '/messages', {
            body: requestBody,
            headers: {
                'RegistrationToken': skypeAccount.registrationTokenParams.raw
            }
        }, (error:any, response:http.IncomingMessage, body:any) => {
            if (!error && response.statusCode === 201) {
                //fixme? send success callback?
            } else {
                Utils.throwError('Failed to send message.' +
                    '.\n Error code: ' + response.statusCode +
                    '.\n Error: ' + error +
                    '.\n Body: ' + body
                );
            }
        });
    }
}

export = MessageService;
