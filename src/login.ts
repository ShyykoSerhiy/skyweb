import * as request from 'request';
import * as cheerio from 'cheerio';
import Utils from './utils';
import SkypeAccount from './skype_account';
import * as Consts from './consts';
import * as http from 'http';
import * as url from 'url';
import {CookieJar} from "request";
import {Promise} from "es6-promise";
import {EventEmitter} from "./utils";

const rejectWithError = (reject:(reason?:any)=>void, error: string, eventEmitter:EventEmitter) => {
    eventEmitter.fire('error', error);
    reject(error);
};

export class Login {
    private requestWithJar: any;
    private cookieJar: CookieJar;
    private eventEmitter: EventEmitter;

    constructor(cookieJar:CookieJar, eventEmitter: EventEmitter) {
        this.cookieJar = cookieJar;
        this.requestWithJar = request.defaults({jar: cookieJar});
        this.eventEmitter = eventEmitter;
    }

    public doLogin(skypeAccount:SkypeAccount) {
        var functions = [new Promise<string>(this.sendLoginRequestOauth.bind(this, skypeAccount)).then((t) => {
            return this.promiseSkypeToken(skypeAccount, t);
        }), this.getRegistrationToken, this.subscribeToResources, this.createStatusEndpoint, this.getSelfDisplayName];

        return <Promise<{}>>(functions.reduce((previousValue:Promise<{}>, currentValue: any)=> {
            return previousValue.then((skypeAccount:SkypeAccount) => {
                return new Promise(currentValue.bind(this, skypeAccount));
            });
        }));
    }

    private sendLoginRequestOauth(skypeAccount:SkypeAccount, resolve: any, reject: any) {
        this.requestWithJar.get(Consts.SKYPEWEB_LOGIN_OAUTH_URL, (error: Error, response: any, body: any) => {
            if (!error && response.statusCode == 200) {
                //we'll need those values to do successful auth
                //sFTTag: '<input type="hidden" name="PPFT" id="i0327" value="somebiglongvalue"/>',
                var ppft = /<input type="hidden" name="PPFT" id="i0327" value="([^"]+)"/g.exec(body)[1];

                if (!ppft) {
                    rejectWithError(reject, 'Failed to find ppft inside.', this.eventEmitter);
                }

                var postParams = {
                    url: Consts.SKYPEWEB_PPSECURE_OUTH_URL,
                    form: {
                        login: skypeAccount.username,
                        passwd: skypeAccount.password,
                        PPFT: ppft
                    }
                };
                this.cookieJar.setCookie(`CkTst=G${new Date().getTime()}`, Consts.SKYPEWEB_LOGIN_LIVE_COM);
                //auth step
                this.requestWithJar.post(postParams, (error: Error, response: any, body: any) => {
                    if (!error && response.statusCode == 200) {
                        var $ = cheerio.load(body);
                        //we need this magic t
                        var t = $('input[name="t"]').val();
                        if (!t) {
                            rejectWithError(reject, 'Failed to find t inside.', this.eventEmitter);
                        }

                        resolve(t);
                    } else {
                        rejectWithError(reject, 'Failed to get t', this.eventEmitter);
                    }
                });
            } else {
                rejectWithError(reject, 'Failed while trying to get ppft', this.eventEmitter);
            }
        });
    }

    private promiseSkypeToken(skypeAccount:SkypeAccount, magicT: string):Promise<SkypeAccount> {
        return new Promise((resolve, reject) => {
            var postParams = {
                url: Consts.SKYPEWEB_LOGIN_MICROSOFT_URL,
                form: {
                    t: magicT, //*friendship* t is magic
                    site_name: 'lw.skype.com',
                    oauthPartner: 999,
                    client_id: 578134,
                    redirect_uri: 'https://web.skype.com'
                }
            };
            this.requestWithJar.post(postParams, (error: Error, response: any, body: any) => {
                if (!error && response.statusCode == 200) {
                    var $ = cheerio.load(body);
                    skypeAccount.skypeToken = $('input[name="skypetoken"]').val();
                    skypeAccount.skypeTokenExpiresIn = parseInt($('input[name="expires_in"]').val());//86400 by default
                    if (skypeAccount.skypeToken && skypeAccount.skypeTokenExpiresIn) {
                        resolve(skypeAccount);
                    } else {
                        rejectWithError(reject, 'Failed to get skypetoken. Username or password is incorrect OR you\'ve' +
                            ' hit a CAPTCHA wall.' + $('.message_error').text(), this.eventEmitter);
                    }
                } else {
                    rejectWithError(reject, `Failed to get skypetocken ${error} ${body} ${response.statusCode}`, this.eventEmitter);
                }
            });
        })
    }

    private getRegistrationToken(skypeAccount:SkypeAccount, resolve: any, reject: any) {
        var currentTime = Utils.getCurrentTime();
        var lockAndKeyResponse = Utils.getMac256Hash(currentTime, Consts.SKYPEWEB_LOCKANDKEY_APPID, Consts.SKYPEWEB_LOCKANDKEY_SECRET);
        this.requestWithJar.post(Consts.SKYPEWEB_HTTPS + skypeAccount.messagesHost + '/v1/users/ME/endpoints', {
            headers: {
                'LockAndKey': 'appId=' + Consts.SKYPEWEB_LOCKANDKEY_APPID + '; time=' + currentTime + '; lockAndKeyResponse=' + lockAndKeyResponse,
                'ClientInfo': 'os=Windows; osVer=10; proc=Win64; lcid=en-us; deviceType=1; country=n/a; clientName=' + Consts.SKYPEWEB_CLIENTINFO_NAME + '; clientVer=' + Consts.SKYPEWEB_CLIENTINFO_VERSION,
                'Authentication': 'skypetoken=' + skypeAccount.skypeToken
            },
            body: JSON.stringify({ endpointFeatures: "Agent" }) //this means *war* that this client can work with bots (aka agents).
        }, (error:any, response:http.IncomingMessage, body:any) => {
            //now lets try retrieve registration token
            if (!error && response.statusCode === 201 || response.statusCode === 301) {
                var locationHeader = response.headers['location'];
                //expecting something like this 'registrationToken=someSting; expires=someNumber; endpointId={someString}'
                var registrationTokenHeader = response.headers['set-registrationtoken'];
                var location = url.parse(locationHeader);
                if (location.host !== skypeAccount.messagesHost) { //mainly when 301, but sometimes when 201
                    skypeAccount.messagesHost = location.host;
                    //looks like messagesHost has changed?
                    this.getRegistrationToken(skypeAccount, resolve, reject);
                    return;
                }

                var registrationTokenParams = registrationTokenHeader.split(/\s*;\s*/).reduce((params: any, current:string) => {
                    if (current.indexOf('registrationToken') === 0) {
                        params['registrationToken'] = current;
                    } else {
                        var index = current.indexOf('=');
                        if (index > 0) {
                            params[current.substring(0, index)] = current.substring(index + 1);
                        }
                    }
                    return params;
                }, {
                    raw: registrationTokenHeader
                });
                if (!registrationTokenParams.registrationToken || !registrationTokenParams.expires || !registrationTokenParams.endpointId) {
                    rejectWithError(reject, 'Failed to find registrationToken or expires or endpointId.', this.eventEmitter);
                    return;
                }
                registrationTokenParams.expires = parseInt(registrationTokenParams.expires);

                skypeAccount.registrationTokenParams = registrationTokenParams;

                //fixme add endpoint and expires!
                resolve(skypeAccount)

            } else {
                rejectWithError(reject, `Failed to get registrationToken. ${error} ${JSON.stringify(response)}`, this.eventEmitter);
            }
        });
    }

    private subscribeToResources(skypeAccount:SkypeAccount, resolve: any, reject: any) {
        var interestedResources = [
            '/v1/threads/ALL',
            '/v1/users/ME/contacts/ALL',
            '/v1/users/ME/conversations/ALL/messages',
            '/v1/users/ME/conversations/ALL/properties'
        ];
        var requestBody = JSON.stringify({
            interestedResources: interestedResources,
            template: 'raw',
            channelType: 'httpLongPoll'//todo web sockets maybe ?
        });

        this.requestWithJar.post(Consts.SKYPEWEB_HTTPS + skypeAccount.messagesHost + '/v1/users/ME/endpoints/SELF/subscriptions', {
            body: requestBody,
            headers: {
                'RegistrationToken': skypeAccount.registrationTokenParams.raw
            }
        }, (error:any, response:http.IncomingMessage, body:any) => {
            if (!error && response.statusCode === 201) {
                resolve(skypeAccount);
            } else {
                rejectWithError(reject, `Failed to subscribe to resources. ${error} ${response.statusCode}`, this.eventEmitter);
            }
        });
    }

    private createStatusEndpoint(skypeAccount:SkypeAccount, resolve: any, reject: any) {
        if (!skypeAccount.registrationTokenParams.endpointId){
            //there is no need in this case to create endpoint?
            resolve(skypeAccount);
            return;
        }
        //a little bit more of skype madness
        var requestBody = JSON.stringify({ //this is exact json that is needed to register endpoint for setting of status.
            "id": "messagingService",
            "type": "EndpointPresenceDoc",
            "selfLink": "uri",
            "privateInfo": {"epname": "skype"},
            "publicInfo": {
                "capabilities": "video|audio",
                "type": 1,
                "skypeNameVersion": Consts.SKYPEWEB_CLIENTINFO_NAME,
                "nodeInfo": "xx",
                "version": Consts.SKYPEWEB_CLIENTINFO_VERSION + '//' + Consts.SKYPEWEB_CLIENTINFO_NAME
            }
        });

        this.requestWithJar.put(Consts.SKYPEWEB_HTTPS + skypeAccount.messagesHost +
            '/v1/users/ME/endpoints/' + skypeAccount.registrationTokenParams.endpointId + '/presenceDocs/messagingService', {
            body: requestBody,
            headers: {
                'RegistrationToken': skypeAccount.registrationTokenParams.raw
            }
        }, (error:any, response:http.IncomingMessage, body:any) => {
            if (!error && response.statusCode === 200) {
                resolve(skypeAccount);
            } else {
                rejectWithError(reject, 'Failed to create endpoint for status.' +
                    '.\n Error code: ' + response.statusCode +
                    '.\n Error: ' + error +
                    '.\n Body: ' + body, this.eventEmitter);
            }
        });
    }

    private getSelfDisplayName(skypeAccout: SkypeAccount, resolve: any, reject: any) {
        this.requestWithJar.get(Consts.SKYPEWEB_HTTPS + Consts.SKYPEWEB_API_SKYPE_HOST + Consts.SKYPEWEB_SELF_DISPLAYNAME_URL, {
            headers: {
                'X-Skypetoken': skypeAccout.skypeToken
            }
        }, function (error: any, response: http.IncomingMessage, body: any) {
            if (!error && response.statusCode == 200) {
                skypeAccout.selfInfo = JSON.parse(body);
                resolve(skypeAccout);
            } else {
                rejectWithError(reject, 'Failed to get selfInfo.' +
                    '.\n Error code: ' + response.statusCode +
                    '.\n Error: ' + error +
                    '.\n Body: ' + body, this.eventEmitter);
            }
        });
    }
}

export default Login;
