var SkypeAccount = require('./skype_account');
var messages = require('./message');
var ContactsService = require('./contacts_service');
var request = require('request');
var Login = require("./login");
var Poll = require("./poll");
var Skyweb = (function () {
    function Skyweb() {
        this.cookieJar = request.jar();
    }
    Skyweb.prototype.login = function (username, password) {
        var _this = this;
        var me = this;
        this.skypeAccount = new SkypeAccount(username, password);
        this.contactsService = new ContactsService(this.cookieJar);
        return new Login(this.cookieJar).doLogin(this.skypeAccount).then(function (skypeAccount) {
            return new Promise(_this.contactsService.loadContacts.bind(_this.contactsService, skypeAccount));
        }).then(function (skypeAccount) {
            new Poll(_this.cookieJar).pollAll(skypeAccount, function (messages) {
                if (me.messagesCallback) {
                    me.messagesCallback(messages);
                }
            });
            return skypeAccount;
        });
    };
    Skyweb.prototype.sendMessage = function (conversationId, message) {
        messages.sendMessage(this.skypeAccount, conversationId, message);
    };
    return Skyweb;
})();
module.exports = Skyweb;
//# sourceMappingURL=skyweb.js.map