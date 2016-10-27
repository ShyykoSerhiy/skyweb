import * as request from 'request';
import * as Consts from './../consts';
import SkypeAccount from './../skype_account';
import Utils from "./../utils";
import * as http from 'http';
import {CookieJar} from "request";
import {Login} from "../login";

export class Poll {
    private requestWithJar: any;
    private cookieJar:CookieJar;

    constructor(cookieJar:CookieJar) {
        this.requestWithJar = request.defaults({jar: cookieJar});
        this.cookieJar = cookieJar;
    }

    public pollAll(skypeAccount: SkypeAccount, messagesCallback:(messages:Array<any>)=>void) {
        setTimeout(()=> {
            this.requestWithJar.post(Consts.SKYPEWEB_HTTPS + skypeAccount.messagesHost + '/v1/users/ME/endpoints/SELF/subscriptions/0/poll', {
                headers: {
                    'RegistrationToken': skypeAccount.registrationTokenParams.raw
                }
            }, (error:any, response:http.IncomingMessage, body:any) => {
                if (!error && response.statusCode === 200) {
                    Poll.parsePollResult(JSON.parse(body), messagesCallback);
                } else if (body && body.errorCode === 729) {
                    // statusCode: 404.
                    // body: {"errorCode":729,"message":"You must create an endpoint before performing this operation."}
                    new Login(this.cookieJar).doLogin(skypeAccount)
                        .then(this.pollAll.bind(this, skypeAccount, messagesCallback));
                    return;
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
            var messages = pollResult.eventMessages.filter((item: any) => {
                return item.resourceType === 'NewMessage'; //Fixme there are a lot more EventMessage's types!
            });
            if (messages.length) {
                messagesCallback(messages);
            }
        }
    }
}

export default Poll;
