/// <reference path='./typings/node/node.d.ts' />
/// <reference path='./typings/form-data/form-data.d.ts' />
/// <reference path='./typings/cheerio/cheerio.d.ts' />
/// <reference path='./typings/request/request.d.ts' />
/// <reference path='./typings/es6-promise/es6-promise.d.ts' />
var request = require('request');
var cheerio = require('cheerio');
var Utils = require('./utils');
var Consts = require('./consts');
var url = require('url');
'use strict';
var requestWithJar = request.defaults({ jar: true });
function getSelfDisplayName(skypeAccout, resolve, reject) {
    requestWithJar.get(Consts.SKYPEWEB_HTTPS + Consts.SKYPEWEB_API_SKYPE_HOST + Consts.SKYPEWEB_SELF_DISPLAYNAME_URL, {
        headers: {
            'X-Skypetoken': skypeAccout.skypeToken
        }
    }, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            skypeAccout.selfInfo = JSON.parse(body);
            resolve(skypeAccout);
        }
        else {
            Utils.throwError('Failed to get selfInfo.');
        }
    });
}
function subscribeToResources(skypeAccount, resolve, reject) {
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
    requestWithJar.post(Consts.SKYPEWEB_HTTPS + skypeAccount.messagesHost + '/v1/users/ME/endpoints/SELF/subscriptions', {
        body: requestBody,
        headers: {
            'RegistrationToken': skypeAccount.registrationTokenParams.raw
        }
    }, function (error, response, body) {
        if (!error && response.statusCode === 201) {
            resolve(skypeAccount);
        }
        else {
            Utils.throwError('Failed to subscribe to resources.');
        }
    });
}
function getRegistrationToken(skypeAccount, resolve, reject) {
    var currentTime = Utils.getCurrentTime();
    var lockAndKeyResponse = Utils.getMac256Hash(currentTime, Consts.SKYPEWEB_LOCKANDKEY_APPID, Consts.SKYPEWEB_LOCKANDKEY_SECRET);
    requestWithJar.post(Consts.SKYPEWEB_HTTPS + skypeAccount.messagesHost + '/v1/users/ME/endpoints', {
        headers: {
            'LockAndKey': 'appId=' + Consts.SKYPEWEB_LOCKANDKEY_APPID + '; time=' + currentTime + '; lockAndKeyResponse=' + lockAndKeyResponse,
            'ClientInfo': 'os=Windows; osVer=10; proc=Win64; lcid=en-us; deviceType=1; country=n/a; clientName=' + Consts.SKYPEWEB_CLIENTINFO_NAME + '; clientVer=' + Consts.SKYPEWEB_CLIENTINFO_VERSION,
            'Authentication': 'skypetoken=' + skypeAccount.skypeToken
        },
        body: '{}'
    }, function (error, response, body) {
        if (!error && response.statusCode === 201) {
            var locationHeader = response.headers['location'];
            var registrationTokenHeader = response.headers['set-registrationtoken'];
            var location = url.parse(locationHeader);
            if (location.host !== skypeAccount.messagesHost) {
                skypeAccount.messagesHost = location.host;
                getRegistrationToken(skypeAccount, resolve, reject);
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
                Utils.throwError('Failed to find registrationToken or expires or endpointId.');
            }
            registrationTokenParams.expires = parseInt(registrationTokenParams.expires);
            skypeAccount.registrationTokenParams = registrationTokenParams;
            resolve(skypeAccount);
        }
        else {
            Utils.throwError('Failed to get registrationToken.');
        }
    });
}
function sendLoginRequest(skypeAccount, resolve, reject) {
    requestWithJar.get(Consts.SKYPEWEB_LOGIN_URL, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var $ = cheerio.load(body);
            var pie = $('input[name="pie"]').val();
            var etm = $('input[name="etm"]').val();
            if (!pie || !etm) {
                Utils.throwError('Failed to find pie or etm.');
            }
            var postParams = {
                url: Consts.SKYPEWEB_LOGIN_URL,
                form: {
                    username: skypeAccount.username,
                    password: skypeAccount.password,
                    pie: pie,
                    etm: etm,
                    timezone_field: Utils.getTimezone(),
                    js_time: Utils.getCurrentTime()
                }
            };
            requestWithJar.post(postParams, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    var $ = cheerio.load(body);
                    skypeAccount.skypeToken = $('input[name="skypetoken"]').val();
                    skypeAccount.skypeTokenExpiresIn = parseInt($('input[name="expires_in"]').val());
                    resolve(skypeAccount);
                }
                else {
                    Utils.throwError('Failed to get skypetoken');
                }
            });
        }
        else {
            Utils.throwError('Failed to get pie and etm. Login failed.');
        }
    });
}
function doLogin(skypeAccount) {
    var functions = [new Promise(sendLoginRequest.bind(null, skypeAccount)), getRegistrationToken, subscribeToResources, getSelfDisplayName];
    return (functions.reduce(function (previousValue, currentValue) {
        return previousValue.then(function (skypeAccount) {
            return new Promise(currentValue.bind(null, skypeAccount));
        });
    }));
}
exports.doLogin = doLogin;
//# sourceMappingURL=login.js.map