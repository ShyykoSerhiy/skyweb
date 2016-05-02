import request = require('request');
import Consts = require('./consts');
import SkypeAccount = require('./skype_account');
import Utils = require('./utils');
import http = require('http');
import {CookieJar} from "request";

class RequestService {
    private requestWithJar;

    constructor(cookieJar:CookieJar) {
        this.requestWithJar = request.defaults({jar: cookieJar});
    }

    accept(skypeAccount, userName) {
        this.requestWithJar.put(Consts.SKYPEWEB_HTTPS + Consts.SKYPEWEB_API_SKYPE_HOST + '/users/self/contacts/auth-request/' + userName + '/accept', {
            headers: {
                'X-Skypetoken': skypeAccount.skypeToken
            }
        }, (error, response, body) => {
            if (!error && response.statusCode === 201) {
                return JSON.parse(body);
            } else {
                Utils.throwError('Failed to accept friend.' + error + "/" + JSON.stringify(response));
            }
        });
    }

    decline(skypeAccount, userName) {
        this.requestWithJar.put(Consts.SKYPEWEB_HTTPS + Consts.SKYPEWEB_API_SKYPE_HOST + '/users/self/contacts/auth-request/' + userName + '/decline', {
            headers: {
                'X-Skypetoken': skypeAccount.skypeToken
            }
        }, (error, response, body)  => {
            if (!error && response.statusCode === 201) {
                return JSON.parse(body);
            } else {
                Utils.throwError('Failed to decline friend.' + error + "/" + JSON.stringify(response));
            }
        });
    }
}

export = RequestService;
