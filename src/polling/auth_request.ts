import request = require('request');
import Consts = require('./../consts');
import SkypeAccount = require('./../skype_account');
import Utils = require("./../utils");
import http = require('http');
import {CookieJar} from "request";

class AuthRequest {
    private requestWithJar;

    constructor(cookieJar:CookieJar) {
        this.requestWithJar = request.defaults({jar: cookieJar});
    }

    pollAll = function (skypeAccount, messagesCallback) {
        setTimeout(()=> {
            this.requestWithJar.get(Consts.SKYPEWEB_HTTPS + Consts.SKYPEWEB_API_SKYPE_HOST + '/users/self/contacts/auth-request', {
                headers: {
                    'X-Skypetoken': skypeAccount.skypeToken
                }
            }, (error, response, body)=> {
                if (!error && response.statusCode === 200) {
                    messagesCallback(JSON.parse(body));
                }
                else {
                    Utils.throwError('Failed to get auth requests.' + error + "/" + JSON.stringify(response));
                }
                this.pollAll(skypeAccount, messagesCallback);
            });
        }, 120000);//optimal request timeout for authcheck is 120 :( seconds. Or we'll get {"statusCode":429,"body":"{\"status\":{\"code\":42900,\"text\":\"Too Many Requests\"}}
    }
}

export = AuthRequest;