/// <reference path='../typings/tsd.d.ts' />
import request = require('request');
import Consts = require('./consts');
import SkypeAccount = require('./skype_account');
import Utils = require('./utils');
import http = require('http');
import {CookieJar} from "request";
import Status = require("./status/status");
'use strict';

class StatusService {
    private requestWithJar;

    constructor(cookieJar:CookieJar) {
        this.requestWithJar = request.defaults({jar: cookieJar});
    }

    public setStatus(skypeAccount:SkypeAccount, status: Status) {
        var requestBody = JSON.stringify({
            status: status
        });
        this.requestWithJar.put(Consts.SKYPEWEB_HTTPS + skypeAccount.messagesHost + '/v1/users/ME/presenceDocs/messagingService', {
            body: requestBody,
            headers: {
                'RegistrationToken': skypeAccount.registrationTokenParams.raw
            }
        }, (error:any, response:http.IncomingMessage, body:any) => {
            if (!error && response.statusCode === 200) {
                //fixme? send success callback?
            } else {
                Utils.throwError('Failed to change status' +
                    '.\n Error code: ' + response.statusCode +
                    '.\n Error: ' + error +
                    '.\n Body: ' + body
                );
            }
        });
    }
}

export = StatusService;
