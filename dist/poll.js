/// <reference path='./typings/node/node.d.ts' />
/// <reference path='./typings/request/request.d.ts' />
var request = require('request');
var Consts = require('./consts');
var Utils = require("./utils");
"use strict";
function parsePollResult(pollResult, messagesCallback) {
    if (pollResult.eventMessages) {
        var messages = pollResult.eventMessages.filter(function (item) {
            return item.resourceType === 'NewMessage';
        });
        if (messages.length) {
            messagesCallback(messages);
        }
    }
}
function pollAll(skypeAccount, messagesCallback) {
    setTimeout(function () {
        request.post(Consts.SKYPEWEB_HTTPS + skypeAccount.messagesHost + '/v1/users/ME/endpoints/SELF/subscriptions/0/poll', {
            headers: {
                'RegistrationToken': skypeAccount.registrationTokenParams.raw
            }
        }, function (error, response, body) {
            if (!error && response.statusCode === 200) {
                parsePollResult(JSON.parse(body), messagesCallback);
            }
            else {
                Utils.throwError();
            }
            pollAll(skypeAccount, messagesCallback);
        });
    }, 1000);
}
exports.pollAll = pollAll;
//# sourceMappingURL=poll.js.map