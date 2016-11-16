import * as request from 'request';
import * as Consts from './consts';
import SkypeAccount from './skype_account';
import Utils from './utils';
import * as http from 'http';
import {CookieJar} from "request";
import {Promise} from "es6-promise";

export interface Member{
    id: string,
    role: 'User' | 'Admin'
}

export class ThreadService {
    private requestWithJar: any;

    constructor(cookieJar:CookieJar) {
        this.requestWithJar = request.defaults({jar: cookieJar});
    }

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
