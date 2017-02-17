import * as request from 'request';
import * as Consts from './consts';
import SkypeAccount from './skype_account';
import Utils from './utils';
import * as http from 'http';
import {CookieJar} from "request";
import Status from "./status/status";
import {EventEmitter} from "./utils";

export class StatusService {
    private requestWithJar: any;
    private eventEmitter: EventEmitter;

    constructor(cookieJar:CookieJar, eventEmitter: EventEmitter) {
        this.requestWithJar = request.defaults({jar: cookieJar});
        this.eventEmitter = eventEmitter;
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
                this.eventEmitter.fire('error', 'Failed to change status' +
                    '.\n Error code: ' + response.statusCode +
                    '.\n Error: ' + error +
                    '.\n Body: ' + body);                
            }
        });
    }
}

export default StatusService;
