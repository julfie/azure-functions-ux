"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Url = (function () {
    function Url() {
    }
    Url.getParameterByName = function (url, name) {
        if (url === null) {
            url = window.location.href;
        }
        name = name.replace(/[\[\]]/g, '\\$&');
        var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)', 'i');
        var results = regex.exec(url);
        if (!results) {
            return null;
        }
        if (!results[2]) {
            return '';
        }
        return decodeURIComponent(results[2].replace(/\+/g, ' '));
    };
    return Url;
}());
exports.Url = Url;
//# sourceMappingURL=url.js.map