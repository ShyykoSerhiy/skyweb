"use strict";
var sha256 = require("js-sha256");
var bigInt = require("big-integer");
var Utils = (function () {
    function Utils() {
    }
    Utils.throwError = function (message) {
        console.error('Something went wrong!' + message);
    };
    Utils.getCurrentTime = function () {
        return (new Date().getTime()) / 1000;
    };
    Utils.getTimezone = function () {
        var pad = function (n, c) {
            if ((n = n + "").length < c) {
                return new Array(++c - n.length).join("0") + n;
            }
            else {
                return n;
            }
        };
        var sign;
        var timezone = new Date().getTimezoneOffset() * (-1);
        if (timezone >= 0) {
            sign = "+";
        }
        else {
            sign = "-";
        }
        timezone = Math.abs(timezone);
        var minutes = timezone % 60;
        var hours = (timezone - minutes) / 60;
        minutes = pad(minutes, 2);
        hours = pad(hours, 2);
        return sign + hours + "|" + minutes;
    };
    Utils.getMac256Hash = function (challenge, appId, key) {
        function padRight(original, totalWidth, ch) {
            function stringFromChar(ch, count) {
                var s = ch;
                for (var i = 1; i < count; i++) {
                    s += ch;
                }
                return s;
            }
            if (original.length < totalWidth) {
                ch = ch || ' ';
                return original + stringFromChar(ch, totalWidth - original.length);
            }
            return original.valueOf();
        }
        function parseHexInt(s) {
            var result = parseInt(s, 16);
            if (isNaN(result)) {
                return 0;
            }
            return result;
        }
        function int32ToHexString(n) {
            var hexChars = '0123456789abcdef';
            var hexString = '';
            for (var i = 0; i <= 3; i++) {
                hexString += hexChars.charAt((n >> (i * 8 + 4)) & 15);
                hexString += hexChars.charAt((n >> (i * 8)) & 15);
            }
            return hexString;
        }
        function int64Xor(a, b) {
            var sA = a.toString(2);
            var sB = b.toString(2);
            var sC = '';
            var sD = '';
            var diff = Math.abs(sA.length - sB.length);
            var i;
            for (i = 0; i < diff; i++) {
                sD += '0';
            }
            if (sA.length < sB.length) {
                sD += sA;
                sA = sD;
            }
            else if (sB.length < sA.length) {
                sD += sB;
                sB = sD;
            }
            for (i = 0; i < sA.length; i++) {
                sC += (sA.charAt(i) === sB.charAt(i)) ? '0' : '1';
            }
            return parseInt(sC.toString(), 2);
        }
        function cS64_C(pdwData, pInHash, pOutHash) {
            var MODULUS = 2147483647;
            if ((pdwData.length < 2) || ((pdwData.length & 1) === 1)) {
                return false;
            }
            var ulCS64_a = pInHash[0] & MODULUS;
            var ulCS64_b = pInHash[1] & MODULUS;
            var ulCS64_c = pInHash[2] & MODULUS;
            var ulCS64_d = pInHash[3] & MODULUS;
            var ulCS64_e = 242854337;
            var CS64_a = bigInt(ulCS64_a.toString());
            var CS64_b = bigInt(ulCS64_b.toString());
            var CS64_c = bigInt(ulCS64_c.toString());
            var CS64_d = bigInt(ulCS64_d.toString());
            var CS64_e = bigInt(ulCS64_e.toString());
            var pos = 0;
            var mod = bigInt(MODULUS.toString());
            var qwDatum = bigInt('0');
            var qwMAC = bigInt('0');
            var qwSum = bigInt('0');
            for (var i = 0; i < pdwData.length / 2; i++) {
                qwDatum = bigInt(pdwData[pos++].toString());
                qwDatum.multiply(CS64_e);
                qwDatum.mod(mod);
                qwMAC.add(qwDatum);
                qwMAC.multiply(CS64_a);
                qwMAC.add(CS64_b);
                qwMAC.mod(mod);
                qwSum.add(qwMAC);
                qwMAC.add(bigInt(pdwData[pos++].toString()));
                qwMAC.multiply(CS64_c);
                qwMAC.add(CS64_d);
                qwMAC.mod(mod);
                qwSum.add(qwMAC);
            }
            qwMAC.add(CS64_b);
            qwMAC.mod(mod);
            qwSum.add(CS64_d);
            qwSum.mod(mod);
            pOutHash[0] = parseInt(qwMAC.toString(10), 10);
            pOutHash[1] = parseInt(qwSum.toString(10), 10);
            return true;
        }
        var clearText = challenge + appId;
        var remaining = 8 - (clearText.length % 8);
        if (remaining !== 8) {
            clearText = padRight(clearText, clearText.length + remaining, '0');
        }
        var cchClearText = clearText.length / 4;
        var pClearText = [];
        var i;
        var pos;
        for (i = 0, pos = 0; i < cchClearText; i++) {
            pClearText.splice(i, 0, 0);
            pClearText[i] = pClearText[i] + clearText.charCodeAt(pos++) * 1;
            pClearText[i] = pClearText[i] + clearText.charCodeAt(pos++) * 256;
            pClearText[i] = pClearText[i] + clearText.charCodeAt(pos++) * 65536;
            pClearText[i] = pClearText[i] + clearText.charCodeAt(pos++) * 16777216;
        }
        var sha256Hash = new Array(4);
        var hash = sha256.sha256(challenge + key).toUpperCase();
        for (i = 0, pos = 0; i < sha256Hash.length; i++) {
            sha256Hash[i] = 0;
            sha256Hash[i] += parseHexInt(hash.substr(pos, 2)) * 1;
            pos += 2;
            sha256Hash[i] += parseHexInt(hash.substr(pos, 2)) * 256;
            pos += 2;
            sha256Hash[i] += parseHexInt(hash.substr(pos, 2)) * 65536;
            pos += 2;
            sha256Hash[i] += parseHexInt(hash.substr(pos, 2)) * 16777216;
            pos += 2;
        }
        var macHash = new Array(2);
        cS64_C(pClearText, sha256Hash, macHash);
        var a = int64Xor(sha256Hash[0], macHash[0]);
        var b = int64Xor(sha256Hash[1], macHash[1]);
        var c = int64Xor(sha256Hash[2], macHash[0]);
        var d = int64Xor(sha256Hash[3], macHash[1]);
        return int32ToHexString(a) + int32ToHexString(b) + int32ToHexString(c) + int32ToHexString(d);
    };
    return Utils;
}());
exports.Utils = Utils;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Utils;
//# sourceMappingURL=utils.js.map