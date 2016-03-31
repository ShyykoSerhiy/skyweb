"use strict";
var Consts = require('./consts');
var SkypeAccount = (function () {
    function SkypeAccount(username, password) {
        this.username = username;
        this.password = password;
        this.messagesHost = Consts.SKYPEWEB_DEFAULT_MESSAGES_HOST;
    }
    Object.defineProperty(SkypeAccount.prototype, "username", {
        get: function () {
            return this._username;
        },
        set: function (username) {
            this._username = username;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SkypeAccount.prototype, "password", {
        get: function () {
            return this._password;
        },
        set: function (password) {
            this._password = password;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SkypeAccount.prototype, "skypeToken", {
        get: function () {
            return this._skypeToken;
        },
        set: function (skypeToken) {
            this._skypeToken = skypeToken;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SkypeAccount.prototype, "skypeTokenExpiresIn", {
        get: function () {
            return this._skypeTokenExpiresIn;
        },
        set: function (skypeTokenExpiresIn) {
            this._skypeTokenExpiresIn = skypeTokenExpiresIn;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SkypeAccount.prototype, "messagesHost", {
        get: function () {
            return this._messagesHost;
        },
        set: function (messagesHost) {
            this._messagesHost = messagesHost;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SkypeAccount.prototype, "registrationTokenParams", {
        get: function () {
            return this._registrationTokenParams;
        },
        set: function (registrationTokenParams) {
            this._registrationTokenParams = registrationTokenParams;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SkypeAccount.prototype, "selfInfo", {
        get: function () {
            return this._selfInfo;
        },
        set: function (selfInfo) {
            this._selfInfo = selfInfo;
        },
        enumerable: true,
        configurable: true
    });
    return SkypeAccount;
}());
module.exports = SkypeAccount;
//# sourceMappingURL=skype_account.js.map