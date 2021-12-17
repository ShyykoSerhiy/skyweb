"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageService = void 0;
var request = require("request");
var Consts = require("./consts");
var MessageService = (function () {
    function MessageService(cookieJar, eventEmitter) {
        this.requestWithJar = request.defaults({ jar: cookieJar });
        this.eventEmitter = eventEmitter;
    }
    MessageService.prototype.sendMessage = function (skypeAccount, conversationId, message, messagetype, contenttype) {
        var _this = this;
        var requestBody = JSON.stringify({
            'content': message,
            'messagetype': messagetype || 'RichText',
            'contenttype': contenttype || 'text'
        });
        this.requestWithJar.post(Consts.SKYPEWEB_HTTPS + skypeAccount.messagesHost + '/v1/users/ME/conversations/' + conversationId + '/messages', {
            body: requestBody,
            headers: {
                'RegistrationToken': skypeAccount.registrationTokenParams.raw
            }
        }, function (error, response, body) {
            if (!error && response.statusCode === 201) {
            }
            else {
                _this.eventEmitter.fire('error', 'Failed to send message.' +
                    '.\n Error code: ' + response.statusCode +
                    '.\n Error: ' + error +
                    '.\n Body: ' + body);
            }
        });
    };
    MessageService.prototype.setTopic = function (skypeAccount, conversationId, message) {
        var _this = this;
        var requestBody = JSON.stringify({
            'topic': message
        });
        this.requestWithJar.put(Consts.SKYPEWEB_HTTPS + skypeAccount.messagesHost + '/v1/threads/' + conversationId + '/properties?name=topic', {
            body: requestBody,
            headers: {
                'RegistrationToken': skypeAccount.registrationTokenParams.raw
            }
        }, function (error, response, body) {
            if (!error && response.statusCode === 201) {
            }
            else {
                _this.eventEmitter.fire('error', 'Failed to send message.' +
                    '.\n Error code: ' + response.statusCode +
                    '.\n Error: ' + error +
                    '.\n Body: ' + body);
            }
        });
    };
    return MessageService;
}());
exports.MessageService = MessageService;
exports.default = MessageService;
//# sourceMappingURL=message_service.js.map