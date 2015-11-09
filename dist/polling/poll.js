/// <reference path='../../typings/tsd.d.ts' />
var request = require('request');
var Consts = require('./../consts');
var Utils = require("./../utils");
"use strict";
var Poll = (function () {
    function Poll(cookieJar) {
        this.requestWithJar = request.defaults({ jar: cookieJar });
    }
    Poll.prototype.pollAll = function (skypeAccount, messagesCallback) {
        var _this = this;
        setTimeout(function () {
            _this.requestWithJar.post(Consts.SKYPEWEB_HTTPS + skypeAccount.messagesHost + '/v1/users/ME/endpoints/SELF/subscriptions/0/poll', {
                headers: {
                    'RegistrationToken': skypeAccount.registrationTokenParams.raw
                }
            }, function (error, response, body) {
                if (!error && response.statusCode === 200) {
                    Poll.parsePollResult(JSON.parse(body), messagesCallback);
                }
                else {
                    Utils.throwError('Failed to poll messages.');
                }
                _this.pollAll(skypeAccount, messagesCallback);
            });
        }, 1000);
    };
    Poll.parsePollResult = function (pollResult, messagesCallback) {
        if (pollResult.eventMessages) {
            var messages = pollResult.eventMessages.filter(function (item) {
                return item.resourceType === 'NewMessage';
            });
            if (messages.length) {
                messagesCallback(messages);
            }
        }
    };
    return Poll;
})();
module.exports = Poll;
//# sourceMappingURL=poll.js.map