"use strict";
var request = require('request');
var Consts = require('./consts');
var utils_1 = require('./utils');
var RequestService = (function () {
    function RequestService(cookieJar) {
        this.requestWithJar = request.defaults({ jar: cookieJar });
    }
    RequestService.prototype.accept = function (skypeAccount, userName) {
        this.requestWithJar.put(Consts.SKYPEWEB_HTTPS + Consts.SKYPEWEB_API_SKYPE_HOST + '/users/self/contacts/auth-request/' + userName + '/accept', {
            headers: {
                'X-Skypetoken': skypeAccount.skypeToken
            }
        }, function (error, response, body) {
            if (!error && response.statusCode === 201) {
                return JSON.parse(body);
            }
            else {
                utils_1.default.throwError('Failed to accept friend.' + error + "/" + JSON.stringify(response));
            }
        });
    };
    RequestService.prototype.decline = function (skypeAccount, userName) {
        this.requestWithJar.put(Consts.SKYPEWEB_HTTPS + Consts.SKYPEWEB_API_SKYPE_HOST + '/users/self/contacts/auth-request/' + userName + '/decline', {
            headers: {
                'X-Skypetoken': skypeAccount.skypeToken
            }
        }, function (error, response, body) {
            if (!error && response.statusCode === 201) {
                return JSON.parse(body);
            }
            else {
                utils_1.default.throwError('Failed to decline friend.' + error + "/" + JSON.stringify(response));
            }
        });
    };
    return RequestService;
}());
exports.RequestService = RequestService;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = RequestService;
//# sourceMappingURL=request_service.js.map