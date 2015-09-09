/// <reference path='./typings/node/node.d.ts' />
/// <reference path='./typings/request/request.d.ts' />
var request = require('request');
var Consts = require('./consts');
var Utils = require('./utils');
'use strict';
var ContactsService = (function () {
    function ContactsService() {
    }
    ContactsService.prototype.loadContacts = function (skypeAccount, resolve, reject) {
        var _this = this;
        request.get(Consts.SKYPEWEB_HTTPS + Consts.SKYPEWEB_CONTACTS_HOST + '/contacts/v1/users/' + skypeAccount.selfInfo.username + '/contacts', {
            headers: {
                'X-Skypetoken': skypeAccount.skypeToken
            }
        }, function (error, response, body) {
            if (!error && response.statusCode === 200) {
                _this.contacts = JSON.parse(body).contacts;
                resolve(skypeAccount, _this.contacts);
            }
            else {
                Utils.throwError('Failed to load contacts.');
            }
        });
    };
    return ContactsService;
})();
module.exports = ContactsService;
//# sourceMappingURL=contacts_service.js.map