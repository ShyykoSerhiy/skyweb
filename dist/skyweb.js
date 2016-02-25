var SkypeAccount = require('./skype_account');
var ContactsService = require('./contacts_service');
var request = require('request');
var Login = require("./login");
var Poll = require("./polling/poll");
var MessageService = require("./message_service");
var StatusService = require("./status_service");
var AuthRequest = require("./polling/auth_request");
var RequestService = require("./request_service");
var es6_promise_1 = require("es6-promise");
var Skyweb = (function () {
    function Skyweb() {
        this.cookieJar = request.jar();
        this.contactsService = new ContactsService(this.cookieJar);
        this.messageService = new MessageService(this.cookieJar);
        this.requestService = new RequestService(this.cookieJar);
        this.statusService = new StatusService(this.cookieJar);
    }
    Skyweb.prototype.login = function (username, password) {
        var _this = this;
        this.skypeAccount = new SkypeAccount(username, password);
        return new Login(this.cookieJar).doLogin(this.skypeAccount).then(function (skypeAccount) {
            return new es6_promise_1.Promise(_this.contactsService.loadContacts.bind(_this.contactsService, skypeAccount));
        }).then(function (skypeAccount) {
            new Poll(_this.cookieJar).pollAll(skypeAccount, function (messages) {
                if (_this.messagesCallback) {
                    _this.messagesCallback(messages);
                }
            });
            new AuthRequest(_this.cookieJar).pollAll(skypeAccount, function (requestData) {
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
})();
module.exports = Skyweb;
//# sourceMappingURL=skyweb.js.map