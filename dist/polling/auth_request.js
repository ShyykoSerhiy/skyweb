var request = require('request');
var Consts = require('./../consts');
var Utils = require("./../utils");
var AuthRequest = (function () {
    function AuthRequest(cookieJar) {
        this.pollAll = function (skypeAccount, messagesCallback) {
            var _this = this;
            setTimeout(function () {
                _this.requestWithJar.get(Consts.SKYPEWEB_HTTPS + Consts.SKYPEWEB_API_SKYPE_HOST + '/users/self/contacts/auth-request', {
                    headers: {
                        'X-Skypetoken': skypeAccount.skypeToken
                    }
                }, function (error, response, body) {
                    if (!error && response.statusCode === 200) {
                        messagesCallback(JSON.parse(body));
                    }
                    else {
                        Utils.throwError('Failed to get auth requests.' + error + "/" + JSON.stringify(response));
                    }
                    _this.pollAll(skypeAccount, messagesCallback);
                });
            }, 120000);
        };
        this.requestWithJar = request.defaults({ jar: cookieJar });
    }
    return AuthRequest;
})();
module.exports = AuthRequest;
//# sourceMappingURL=auth_request.js.map