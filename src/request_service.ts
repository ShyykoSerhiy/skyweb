import * as request from 'request';
import * as Consts from './consts';
import SkypeAccount from './skype_account';
import Utils from './utils';
import * as http from 'http';
import {CookieJar} from "request";
import {EventEmitter} from "./utils";

export class RequestService {
    private requestWithJar: any;
    private eventEmitter: EventEmitter;

    constructor(cookieJar:CookieJar, eventEmitter: EventEmitter) {
        this.requestWithJar = request.defaults({jar: cookieJar});
        this.eventEmitter = eventEmitter;
    }

    accept(skypeAccount: any, userName: any) {
        this.requestWithJar.put(Consts.SKYPEWEB_HTTPS + Consts.SKYPEWEB_API_SKYPE_HOST + '/users/self/contacts/auth-request/' + userName + '/accept', {
            headers: {
                'X-Skypetoken': skypeAccount.skypeToken
            }
        }, (error: any, response: any, body: any) => {
            if (!error && response.statusCode === 201) {
                return JSON.parse(body);
            } else {
                this.eventEmitter.fire('error', 'Failed to accept friend.' + error + "/" + JSON.stringify(response));
            }
        });
    }

    decline(skypeAccount: any, userName: any) {
        this.requestWithJar.put(Consts.SKYPEWEB_HTTPS + Consts.SKYPEWEB_API_SKYPE_HOST + '/users/self/contacts/auth-request/' + userName + '/decline', {
            headers: {
                'X-Skypetoken': skypeAccount.skypeToken
            }
        }, (error: any, response: any, body: any)  => {
            if (!error && response.statusCode === 201) {
                return JSON.parse(body);
            } else {
                this.eventEmitter.fire('error', 'Failed to decline friend.' + error + "/" + JSON.stringify(response));
            }
        });
    }
}

export default RequestService;
