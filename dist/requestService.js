var request = require('request');
var Consts = require('./consts');
var Utils = require('./utils');
'use strict';
var RequestService = (function () {
    function RequestService(cookieJar) {
        this.requestWithJar = request.defaults({ jar: cookieJar });
    }
		RequestService.prototype.accept = function (skypeAccount, userName) {
        this.requestWithJar(
				{
						url: Consts.SKYPEWEB_HTTPS + Consts.SKYPEWEB_API_SKYPE_HOST + '/users/self/contacts/auth-request/' + userName + '/accept', 
						method: "PUT",
            headers: {
                'X-Skypetoken': skypeAccount.skypeToken
            }
        }, function (error, response, body) {
            if (!error && response.statusCode === 201) {
							
							return JSON.parse(body);
            }
            else {
							console.log(error + "/" + JSON.stringify(response));
                Utils.throwError('Failed to accept friend.');
            }
        });
		};
		RequestService.prototype.decline = function (skypeAccount, userName) {
        this.requestWithJar(
				{
						url: Consts.SKYPEWEB_HTTPS + Consts.SKYPEWEB_API_SKYPE_HOST + '/users/self/contacts/auth-request/' + userName + '/decline', 
						method: "PUT",
            headers: {
                'X-Skypetoken': skypeAccount.skypeToken
            }
        }, function (error, response, body) {
            if (!error && response.statusCode === 201) {
							
							return JSON.parse(body);
            }
            else {
							console.log(error + "/" + JSON.stringify(response));
                Utils.throwError('Failed to decline friend.');
            }
        });
		};
	return RequestService;
})();
module.exports = RequestService;