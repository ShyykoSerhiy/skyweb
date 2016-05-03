"use strict";
var request = require('request');
var Consts = require('./consts');
var utils_1 = require('./utils');
var StatusService = (function () {
    function StatusService(cookieJar) {
        this.requestWithJar = request.defaults({ jar: cookieJar });
    }
    StatusService.prototype.setStatus = function (skypeAccount, status) {
        var requestBody = JSON.stringify({
            status: status
        });
        this.requestWithJar.put(Consts.SKYPEWEB_HTTPS + skypeAccount.messagesHost + '/v1/users/ME/presenceDocs/messagingService', {
            body: requestBody,
            headers: {
                'RegistrationToken': skypeAccount.registrationTokenParams.raw
            }
        }, function (error, response, body) {
            if (!error && response.statusCode === 200) {
            }
            else {
                utils_1.default.throwError('Failed to change status' +
                    '.\n Error code: ' + response.statusCode +
                    '.\n Error: ' + error +
                    '.\n Body: ' + body);
            }
        });
    };
    return StatusService;
}());
exports.StatusService = StatusService;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = StatusService;
//# sourceMappingURL=status_service.js.map