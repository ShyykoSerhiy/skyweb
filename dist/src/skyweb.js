"use strict";
var skype_account_1 = require('./skype_account');
var contacts_service_1 = require('./contacts_service');
var request = require('request');
var login_1 = require("./login");
var poll_1 = require("./polling/poll");
var message_service_1 = require("./message_service");
var status_service_1 = require("./status_service");
var auth_request_1 = require("./polling/auth_request");
var request_service_1 = require("./request_service");
var es6_promise_1 = require("es6-promise");
var Skyweb = (function () {
    function Skyweb() {
        this.cookieJar = request.jar();
        this.contactsService = new contacts_service_1.default(this.cookieJar);
        this.messageService = new message_service_1.default(this.cookieJar);
        this.requestService = new request_service_1.default(this.cookieJar);
        this.statusService = new status_service_1.default(this.cookieJar);
    }
    Skyweb.prototype.login = function (username, password) {
        var _this = this;
        this.skypeAccount = new skype_account_1.default(username, password);
        return new login_1.default(this.cookieJar).doLogin(this.skypeAccount).then(function (skypeAccount) {
            return new es6_promise_1.Promise(_this.contactsService.loadContacts.bind(_this.contactsService, skypeAccount));
        }).then(function (skypeAccount) {
            new poll_1.default(_this.cookieJar).pollAll(skypeAccount, function (messages) {
                if (_this.messagesCallback) {
                    _this.messagesCallback(messages);
                }
            });
            new auth_request_1.default(_this.cookieJar).pollAll(skypeAccount, function (requestData) {
                if (_this.authRequestCallback) {
                    _this.authRequestCallback(requestData);
                }
            });
            return skypeAccount;
        });
    };
    Skyweb.prototype.sendMessage = function (conversationId, message, messagetype, contenttype) {
        this.messageService.sendMessage(this.skypeAccount, conversationId, message, messagetype, contenttype);
    };
    Skyweb.prototype.setStatus = function (status) {
        this.statusService.setStatus(this.skypeAccount, status);
    };
    Skyweb.prototype.acceptAuthRequest = function (username) {
        return this.requestService.accept(this.skypeAccount, username);
    };
    Skyweb.prototype.declineAuthRequest = function (username) {
        return this.requestService.decline(this.skypeAccount, username);
    };
    return Skyweb;
}());
exports = Skyweb;
exports.Skyweb = Skyweb;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Skyweb;
//# sourceMappingURL=skyweb.js.map