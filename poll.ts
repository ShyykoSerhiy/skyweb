/// <reference path='./typings/node/node.d.ts' />
/// <reference path='./typings/request/request.d.ts' />
import request = require('request');
import Consts = require('./consts');
import SkypeAccount = require('./skype_account');
import Utils = require("./utils");
import http = require('http');
"use strict";


function parsePollResult(pollResult:any, messagesCallback:(messages:Array<any>)=>void) {
    if (pollResult.eventMessages) {
        var messages = pollResult.eventMessages.filter((item) => {
            return item.resourceType === 'NewMessage'; //Fixme there are a lot more EventMessage's types!
        });
        if (messages.length){
            messagesCallback(messages);
        }
    }
}

export function pollAll(skypeAccount:SkypeAccount, messagesCallback:(messages:Array<any>)=>void) {
    setTimeout(()=> {
        request.post(Consts.SKYPEWEB_HTTPS + skypeAccount.messagesHost + '/v1/users/ME/endpoints/SELF/subscriptions/0/poll', {
            headers: {
                'RegistrationToken': skypeAccount.registrationTokenParams.raw
            }
        }, (error:any, response:http.IncomingMessage, body:any) => {
            if (!error && response.statusCode === 200) {
                parsePollResult(JSON.parse(body), messagesCallback);
            } else {
                Utils.throwError('Failed to poll messages.');
            }
            pollAll(skypeAccount, messagesCallback);
        });
    }, 1000);
}