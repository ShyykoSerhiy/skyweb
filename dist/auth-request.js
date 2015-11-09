var request = require('request');
var Consts = require('./consts');
var Utils = require("./utils");
"use strict";
var AuthRequest = (function () {
    function AuthRequest(cookieJar) {
        this.requestWithJar = request.defaults({ jar: cookieJar });
    }
    AuthRequest.prototype.pollAll = function (skypeAccount, messagesCallback) {
        var _this = this;
        setTimeout(function () {
            _this.requestWithJar.get(Consts.SKYPEWEB_HTTPS + Consts.SKYPEWEB_API_SKYPE_HOST + '/users/self/contacts/auth-request', {
								headers: {
                    'X-Skypetoken': skypeAccount.skypeToken
                }
            }, function (error, response, body) {
                if (!error && response.statusCode === 200) {
                    if(body != "[]") messagesCallback(JSON.parse(body));
                }
                else {
                    Utils.throwError('Failed to AuthRequest messages.');
                }
                _this.pollAll(skypeAccount, messagesCallback);
            });
        }, 1000);
    };
    return AuthRequest;
})();
module.exports = AuthRequest;