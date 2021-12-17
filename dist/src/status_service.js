"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatusService = void 0;
var request = require("request");
var Consts = require("./consts");
var StatusService = (function () {
    function StatusService(cookieJar, eventEmitter) {
        this.requestWithJar = request.defaults({ jar: cookieJar });
        this.eventEmitter = eventEmitter;
    }
    StatusService.prototype.setStatus = function (skypeAccount, status) {
        var _this = this;
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
                _this.eventEmitter.fire('error', 'Failed to change status' +
                    '.\n Error code: ' + response.statusCode +
                    '.\n Error: ' + error +
                    '.\n Body: ' + body);
            }
        });
    };
    return StatusService;
}());
exports.StatusService = StatusService;
exports.default = StatusService;
//# sourceMappingURL=status_service.js.map