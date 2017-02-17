import * as request from 'request';
import * as Consts from './consts';
import SkypeAccount from './skype_account';
import Utils from './utils';
import * as http from 'http';
import {CookieJar} from "request";
import {Promise} from "es6-promise";
import {EventEmitter} from "./utils";

export interface Member{
    /**
     * Member id in format 8:tomriddle9154 if old skype account and 8:live:tomriddle9154 if live account
     */
    id: string,
    /**
     * Role for this user in group. Note that you should probably add at least one 'Admin' to the group.
     */
    role: 'User' | 'Admin'
}

export class ThreadService {
    private requestWithJar: any;
    private eventEmitter: EventEmitter;

    constructor(cookieJar:CookieJar, eventEmitter: EventEmitter) {
        this.requestWithJar = request.defaults({jar: cookieJar});
        this.eventEmitter = eventEmitter;
    }
    /**
     * Creates thread (skype group) with provided members. You should include yourself as an Admin.
     * @return promise with thread id in format 19:0fe2w7d11fa649g99036e3sv39a52721@thread.skype 
     */
    create(skypeAccount:SkypeAccount, members:Member[]) : Promise<string> {
        var promise = new Promise<string>( (resolve,reject) => {
            var requestBody = JSON.stringify({                
                'members': members || []
            });

            this.requestWithJar.post(Consts.SKYPEWEB_HTTPS + skypeAccount.messagesHost + '/v1/threads', {
                body: requestBody,
                headers: {
                    'RegistrationToken': skypeAccount.registrationTokenParams.raw
                }
            }, (error:any, response:http.IncomingMessage, body:any) => {
                if (!error && response.statusCode === 201) {
                    var threadID = /threads\/(.*@thread.skype)/.exec( response.headers.location )[1];
                    resolve(threadID);
                } else {
                    reject('Failed to create thread.' +
                        '.\n Error code: ' + response.statusCode +
                        '.\n Error: ' + error +
                        '.\n Body: ' + body
                    );
                }
            });

        });

        return promise;
    }
}

export default ThreadService;
