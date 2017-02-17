import * as request from 'request';
import * as Consts from './../consts';
import SkypeAccount from './../skype_account';
import Utils from "./../utils";
import * as http from 'http';
import {CookieJar} from "request";
import {EventEmitter} from "../utils";

/**
 * @deprecated skype for web now uses websockets.
 */
export class AuthRequest {
    private requestWithJar: any;
    private eventEmitter: EventEmitter;

    constructor(cookieJar:CookieJar, eventEmitter: EventEmitter) {
        this.requestWithJar = request.defaults({jar: cookieJar});
        this.eventEmitter = eventEmitter;
    }

    public pollAll(skypeAccount: any, messagesCallback: any) {
        setTimeout(()=> {
            this.requestWithJar.get(Consts.SKYPEWEB_HTTPS + Consts.SKYPEWEB_API_SKYPE_HOST + '/users/self/contacts/auth-request', {
                headers: {
                    'X-Skypetoken': skypeAccount.skypeToken
                }
            }, (error: any, response: any, body: any)=> {
                if (!error && response.statusCode === 200) {
                    messagesCallback(JSON.parse(body));
                }
                else {
                    this.eventEmitter.fire('error', 'Failed to get auth requests.' + error + "/" + JSON.stringify(response));                    
                }
                this.pollAll(skypeAccount, messagesCallback);
            });
        }, 120000);//optimal request timeout for authcheck is 120 :( seconds. Or we'll get {"statusCode":429,"body":"{\"status\":{\"code\":42900,\"text\":\"Too Many Requests\"}}
    }
}

export default AuthRequest;
