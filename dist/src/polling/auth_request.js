"use strict";
var request = require("request");
var Consts = require("./../consts");
var AuthRequest = (function () {
    function AuthRequest(cookieJar, eventEmitter) {
        this.requestWithJar = request.defaults({ jar: cookieJar });
        this.eventEmitter = eventEmitter;
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
                    messagesCallback(JSON.parse(body));
                }
                else {
                    _this.eventEmitter.fire('error', 'Failed to get auth requests.' + error + "/" + JSON.stringify(response));
                }
                _this.pollAll(skypeAccount, messagesCallback);
            });
        }, 120000);
    };
    return AuthRequest;
}());
exports.AuthRequest = AuthRequest;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = AuthRequest;
//# sourceMappingURL=auth_request.js.map