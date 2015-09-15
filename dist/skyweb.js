var SkypeAccount = require('./skype_account');
var ContactsService = require('./contacts_service');
var request = require('request');
var Login = require("./login");
var Poll = require("./poll");
var MessageService = require("./message");
var Skyweb = (function () {
    function Skyweb() {
        this.cookieJar = request.jar();
        this.contactsService = new ContactsService(this.cookieJar);
        this.messageService = new MessageService(this.cookieJar);
    }
    Skyweb.prototype.login = function (username, password) {
        var _this = this;
        var me = this;
        this.skypeAccount = new SkypeAccount(username, password);
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
        this.messageService.sendMessage(this.skypeAccount, conversationId, message);
    };
    return Skyweb;
})();
module.exports = Skyweb;
//# sourceMappingURL=skyweb.js.map