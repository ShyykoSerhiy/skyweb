"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Login = void 0;
var request = require("request");
var cheerio = require("cheerio");
var utils_1 = require("./utils");
var Consts = require("./consts");
var url = require("url");
var es6_promise_1 = require("es6-promise");
var rejectWithError = function (reject, error, eventEmitter) {
    eventEmitter.fire('error', error);
    reject(error);
};
var Login = (function () {
    function Login(cookieJar, eventEmitter) {
        this.cookieJar = cookieJar;
        this.requestWithJar = request.defaults({ jar: cookieJar });
        this.eventEmitter = eventEmitter;
    }
    Login.prototype.doLogin = function (skypeAccount) {
        var _this = this;
        var functions = [new es6_promise_1.Promise(this.sendLoginRequestOauth.bind(this, skypeAccount)).then(function (t) {
                return _this.promiseSkypeToken(skypeAccount, t);
            }), this.getRegistrationToken, this.subscribeToResources, this.createStatusEndpoint, this.getSelfDisplayName];
        return (functions.reduce(function (previousValue, currentValue) {
            return previousValue.then(function (skypeAccount) {
                return new es6_promise_1.Promise(currentValue.bind(_this, skypeAccount));
            });
        }));
    };
    Login.prototype.sendLoginRequestOauth = function (skypeAccount, resolve, reject) {
        var _this = this;
        this.requestWithJar.get(Consts.SKYPEWEB_LOGIN_OAUTH_URL, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                var ppft = /<input type="hidden" name="PPFT" id="i0327" value="([^"]+)"/g.exec(body)[1];
                if (!ppft) {
                    rejectWithError(reject, 'Failed to find ppft inside.', _this.eventEmitter);
                }
                var postParams = {
                    url: Consts.SKYPEWEB_PPSECURE_OUTH_URL,
                    form: {
                        login: skypeAccount.username,
                        passwd: skypeAccount.password,
                        PPFT: ppft,
                        opid: ''
                    }
                };
                _this.cookieJar.setCookie("CkTst=G" + new Date().getTime(), Consts.SKYPEWEB_LOGIN_LIVE_COM);
                _this.requestWithJar.post(postParams, function (error, response, body) {
                    if (!error && response.statusCode == 200) {
                        var opid = /opid=([A-Z0-9]+)/g.exec(body)[1];
                        if (!opid) {
                            return rejectWithError(reject, 'Failed to get opid', _this.eventEmitter);
                        }
                        postParams.form['opid'] = opid;
                        _this.requestWithJar.post(postParams, function (error, response, body) {
                            if (error || !response || !body) {
                                return rejectWithError(reject, 'Failed to find t inside.', this.eventEmitter);
                            }
                            var $ = cheerio.load(body);
                            var t = $('input[name="t"]').val();
                            if (!t) {
                                rejectWithError(reject, 'Failed to find t inside.', this.eventEmitter);
                            }
                            resolve(t);
                        });
                    }
                    else {
                        rejectWithError(reject, 'Failed to get t', _this.eventEmitter);
                    }
                });
            }
            else {
                rejectWithError(reject, 'Failed while trying to get ppft', _this.eventEmitter);
            }
        });
    };
    Login.prototype.promiseSkypeToken = function (skypeAccount, magicT) {
        var _this = this;
        return new es6_promise_1.Promise(function (resolve, reject) {
            var postParams = {
                url: Consts.SKYPEWEB_LOGIN_MICROSOFT_URL,
                form: {
                    t: magicT,
                    site_name: 'lw.skype.com',
                    oauthPartner: 999,
                    client_id: 578134,
                    redirect_uri: 'https://web.skype.com'
                }
            };
            _this.requestWithJar.post(postParams, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    var $ = cheerio.load(body);
                    skypeAccount.skypeToken = $('input[name="skypetoken"]').val();
                    skypeAccount.skypeTokenExpiresIn = parseInt($('input[name="expires_in"]').val());
                    if (skypeAccount.skypeToken && skypeAccount.skypeTokenExpiresIn) {
                        resolve(skypeAccount);
                    }
                    else {
                        rejectWithError(reject, 'Failed to get skypetoken. Username or password is incorrect OR you\'ve' +
                            ' hit a CAPTCHA wall.' + $('.message_error').text(), _this.eventEmitter);
                    }
                }
                else {
                    rejectWithError(reject, "Failed to get skypetocken " + error + " " + body + " " + response.statusCode, _this.eventEmitter);
                }
            });
        });
    };
    Login.prototype.getRegistrationToken = function (skypeAccount, resolve, reject) {
        var _this = this;
        var currentTime = utils_1.default.getCurrentTime();
        var lockAndKeyResponse = utils_1.default.getMac256Hash(currentTime, Consts.SKYPEWEB_LOCKANDKEY_APPID, Consts.SKYPEWEB_LOCKANDKEY_SECRET);
        this.requestWithJar.post(Consts.SKYPEWEB_HTTPS + skypeAccount.messagesHost + '/v1/users/ME/endpoints', {
            headers: {
                'LockAndKey': 'appId=' + Consts.SKYPEWEB_LOCKANDKEY_APPID + '; time=' + currentTime + '; lockAndKeyResponse=' + lockAndKeyResponse,
                'ClientInfo': 'os=Windows; osVer=10; proc=Win64; lcid=en-us; deviceType=1; country=n/a; clientName=' + Consts.SKYPEWEB_CLIENTINFO_NAME + '; clientVer=' + Consts.SKYPEWEB_CLIENTINFO_VERSION,
                'Authentication': 'skypetoken=' + skypeAccount.skypeToken
            },
            body: JSON.stringify({ endpointFeatures: "Agent" })
        }, function (error, response, body) {
            if (!error && response.statusCode === 201 || response.statusCode === 301) {
                var locationHeader = response.headers['location'];
                var registrationTokenHeader = response.headers['set-registrationtoken'];
                var location = url.parse(locationHeader);
                if (location.host !== skypeAccount.messagesHost) {
                    skypeAccount.messagesHost = location.host;
                    _this.getRegistrationToken(skypeAccount, resolve, reject);
                    return;
                }
                var registrationTokenParams = registrationTokenHeader.split(/\s*;\s*/).reduce(function (params, current) {
                    if (current.indexOf('registrationToken') === 0) {
                        params['registrationToken'] = current;
                    }
                    else {
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
                    rejectWithError(reject, 'Failed to find registrationToken or expires or endpointId.', _this.eventEmitter);
                    return;
                }
                registrationTokenParams.expires = parseInt(registrationTokenParams.expires);
                skypeAccount.registrationTokenParams = registrationTokenParams;
                resolve(skypeAccount);
            }
            else {
                rejectWithError(reject, "Failed to get registrationToken. " + error + " " + JSON.stringify(response), _this.eventEmitter);
            }
        });
    };
    Login.prototype.subscribeToResources = function (skypeAccount, resolve, reject) {
        var _this = this;
        var interestedResources = [
            '/v1/threads/ALL',
            '/v1/users/ME/contacts/ALL',
            '/v1/users/ME/conversations/ALL/messages',
            '/v1/users/ME/conversations/ALL/properties'
        ];
        var requestBody = JSON.stringify({
            interestedResources: interestedResources,
            template: 'raw',
            channelType: 'httpLongPoll'
        });
        this.requestWithJar.post(Consts.SKYPEWEB_HTTPS + skypeAccount.messagesHost + '/v1/users/ME/endpoints/SELF/subscriptions', {
            body: requestBody,
            headers: {
                'RegistrationToken': skypeAccount.registrationTokenParams.raw
            }
        }, function (error, response, body) {
            if (!error && response.statusCode === 201) {
                resolve(skypeAccount);
            }
            else {
                rejectWithError(reject, "Failed to subscribe to resources. " + error + " " + response.statusCode, _this.eventEmitter);
            }
        });
    };
    Login.prototype.createStatusEndpoint = function (skypeAccount, resolve, reject) {
        var _this = this;
        if (!skypeAccount.registrationTokenParams.endpointId) {
            resolve(skypeAccount);
            return;
        }
        var requestBody = JSON.stringify({
            "id": "messagingService",
            "type": "EndpointPresenceDoc",
            "selfLink": "uri",
            "privateInfo": { "epname": "skype" },
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
        }, function (error, response, body) {
            if (!error && response.statusCode === 200) {
                resolve(skypeAccount);
            }
            else {
                rejectWithError(reject, 'Failed to create endpoint for status.' +
                    '.\n Error code: ' + response.statusCode +
                    '.\n Error: ' + error +
                    '.\n Body: ' + body, _this.eventEmitter);
            }
        });
    };
    Login.prototype.getSelfDisplayName = function (skypeAccout, resolve, reject) {
        this.requestWithJar.get(Consts.SKYPEWEB_HTTPS + Consts.SKYPEWEB_API_SKYPE_HOST + Consts.SKYPEWEB_SELF_DISPLAYNAME_URL, {
            headers: {
                'X-Skypetoken': skypeAccout.skypeToken
            }
        }, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                skypeAccout.selfInfo = JSON.parse(body);
                resolve(skypeAccout);
            }
            else {
                rejectWithError(reject, 'Failed to get selfInfo.' +
                    '.\n Error code: ' + response.statusCode +
                    '.\n Error: ' + error +
                    '.\n Body: ' + body, this.eventEmitter);
            }
        });
    };
    return Login;
}());
exports.Login = Login;
exports.default = Login;
//# sourceMappingURL=login.js.map