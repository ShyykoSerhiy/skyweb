var request = require('request');
var Utils = require('./utils');
var Consts = require('./consts');
var es6_promise_1 = require("es6-promise");
'use strict';
var Logout = (function () {
    function Logout(cookieJar) {
        this.requestWithJar = request.defaults({ jar: cookieJar });
    }
    Logout.prototype.doLogout = function () {
        var _this = this;
        var functions = [new es6_promise_1.Promise(this.sendLogoutRequest.bind(this))];
        return (functions.reduce(function (previousValue, currentValue) {
            return previousValue.then(function (skypeAccount) {
                return new es6_promise_1.Promise(currentValue.bind(_this, skypeAccount));
            });
        }));
    };
    Logout.prototype.sendLogoutRequest = function () {
        this.requestWithJar.get(Consts.SKYPEWEB_LOGOUT_URL, function (error, response, body) {
        });
    };
    return Logout;
})();
module.exports = Logout;