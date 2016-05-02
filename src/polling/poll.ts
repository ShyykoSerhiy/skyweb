import request = require('request');
import Consts = require('./../consts');
import SkypeAccount = require('./../skype_account');
import Utils = require("./../utils");
import http = require('http');
import {CookieJar} from "request";
"use strict";

class Poll {
    private requestWithJar;

    constructor(cookieJar:CookieJar) {
        this.requestWithJar = request.defaults({jar: cookieJar});
    }

    public pollAll(skypeAccount:SkypeAccount, messagesCallback:(messages:Array<any>)=>void) {
        setTimeout(()=> {
            this.requestWithJar.post(Consts.SKYPEWEB_HTTPS + skypeAccount.messagesHost + '/v1/users/ME/endpoints/SELF/subscriptions/0/poll', {
                headers: {
                    'RegistrationToken': skypeAccount.registrationTokenParams.raw
                }
            }, (error:any, response:http.IncomingMessage, body:any) => {
                if (!error && response.statusCode === 200) {
                    Poll.parsePollResult(JSON.parse(body), messagesCallback);
                } else {
                    Utils.throwError('Failed to poll messages.' +
                        '.\n Error code: ' + (response && response.statusCode ? response.statusCode : 'none') +
                        '.\n Error: ' + error +
                        '.\n Body: ' + body
                    );
                }
                this.pollAll(skypeAccount, messagesCallback);
            });
        }, 1000);
    }

    private static parsePollResult(pollResult:any, messagesCallback:(messages:Array<any>)=>void) {
        if (pollResult.eventMessages) {
            var messages = pollResult.eventMessages.filter((item) => {
                return item.resourceType === 'NewMessage'; //Fixme there are a lot more EventMessage's types!
            });
            if (messages.length) {
                messagesCallback(messages);
            }
        }
    }
}

export = Poll;
