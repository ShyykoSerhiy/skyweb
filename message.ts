/// <reference path='./typings/node/node.d.ts' />
/// <reference path='./typings/request/request.d.ts' />
import request = require('request');
import Consts = require('./consts');
import SkypeAccount = require('./skype_account');
import Utils = require('./utils');
import http = require('http');
'use strict';

class MessageService {
    static sendMessage(skypeAccount:SkypeAccount, conversationId:string, message:string) {
        var requestBody = JSON.stringify({
            ///'clientmessageid': Utils.getCurrentTime() + '', //fixme looks like we don't need this?(at least if we don't want to
            // have the ability to modify text(content) of the message.)
            'content': message,
            'messagetype': 'RichText',
            'contenttype': 'text'
        });
        console.log('sending message ' + requestBody);
        request.post(Consts.SKYPEWEB_HTTPS + skypeAccount.messagesHost + '/v1/users/ME/conversations/' + conversationId + '/messages', {
            body: requestBody,
            headers: {
                'RegistrationToken': skypeAccount.registrationTokenParams.raw
            }
        }, (error:any, response:http.IncomingMessage, body:any) => {
            if (!error && response.statusCode === 201) {
                //fixme? send success callback?
            } else {
                Utils.throwError();
            }
        });
    }
}

export = MessageService;
