"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThreadService = void 0;
var request = require("request");
var Consts = require("./consts");
var es6_promise_1 = require("es6-promise");
var ThreadService = (function () {
    function ThreadService(cookieJar, eventEmitter) {
        this.requestWithJar = request.defaults({ jar: cookieJar });
        this.eventEmitter = eventEmitter;
    }
    ThreadService.prototype.create = function (skypeAccount, members) {
        var _this = this;
        var promise = new es6_promise_1.Promise(function (resolve, reject) {
            var requestBody = JSON.stringify({
                'members': members || []
            });
            _this.requestWithJar.post(Consts.SKYPEWEB_HTTPS + skypeAccount.messagesHost + '/v1/threads', {
                body: requestBody,
                headers: {
                    'RegistrationToken': skypeAccount.registrationTokenParams.raw
                }
            }, function (error, response, body) {
                if (!error && response.statusCode === 201) {
                    var threadID = /threads\/(.*@thread.skype)/.exec(response.headers.location)[1];
                    resolve(threadID);
                }
                else {
                    reject('Failed to create thread.' +
                        '.\n Error code: ' + response.statusCode +
                        '.\n Error: ' + error +
                        '.\n Body: ' + body);
                }
            });
        });
        return promise;
    };
    return ThreadService;
}());
exports.ThreadService = ThreadService;
exports.default = ThreadService;
//# sourceMappingURL=thread_service.js.map