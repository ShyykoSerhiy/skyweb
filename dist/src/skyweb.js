"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var skype_account_1 = require("./skype_account");
var contacts_service_1 = require("./contacts_service");
var request = require("request");
var login_1 = require("./login");
var poll_1 = require("./polling/poll");
var message_service_1 = require("./message_service");
var status_service_1 = require("./status_service");
var request_service_1 = require("./request_service");
var thread_service_1 = require("./thread_service");
var es6_promise_1 = require("es6-promise");
var utils_1 = require("./utils");
var Skyweb = (function () {
    function Skyweb() {
        this.cookieJar = request.jar();
        this.eventEmitter = new utils_1.EventEmitter();
        this.contactsService = new contacts_service_1.default(this.cookieJar, this.eventEmitter);
        this.messageService = new message_service_1.default(this.cookieJar, this.eventEmitter);
        this.requestService = new request_service_1.default(this.cookieJar, this.eventEmitter);
        this.statusService = new status_service_1.default(this.cookieJar, this.eventEmitter);
        this.requestService = new request_service_1.default(this.cookieJar, this.eventEmitter);
        this.threadService = new thread_service_1.default(this.cookieJar, this.eventEmitter);
    }
    Skyweb.prototype.login = function (username, password) {
        var _this = this;
        this.skypeAccount = new skype_account_1.default(username, password);
        return new login_1.default(this.cookieJar, this.eventEmitter).doLogin(this.skypeAccount).then(function (skypeAccount) {
            return new es6_promise_1.Promise(_this.contactsService.loadContacts.bind(_this.contactsService, skypeAccount));
        }).then(function (skypeAccount) {
            new poll_1.default(_this.cookieJar, _this.eventEmitter).pollAll(skypeAccount, function (messages) {
                if (_this.messagesCallback) {
                    _this.messagesCallback(messages);
                }
            });
            return skypeAccount;
        });
    };
    Skyweb.prototype.sendMessage = function (conversationId, message, messagetype, contenttype) {
        this.messageService.sendMessage(this.skypeAccount, conversationId, message, messagetype, contenttype);
    };
    Skyweb.prototype.setTopic = function (conversationId, message) {
        this.messageService.setTopic(this.skypeAccount, conversationId, message);
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
    Skyweb.prototype.createThread = function (members) {
        return this.threadService.create(this.skypeAccount, members);
    };
    Skyweb.prototype.on = function (eventName, listener) {
        this.eventEmitter.on(eventName, listener);
    };
    Skyweb.prototype.un = function (eventName, listener) {
        this.eventEmitter.un(eventName, listener);
    };
    return Skyweb;
}());
exports.default = Skyweb;
//# sourceMappingURL=skyweb.js.map