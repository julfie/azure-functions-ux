"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("core-js/es6/symbol");
if (!Object.byString) {
    Object.byString = function (o, s) {
        try {
            s = s.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
            s = s.replace(/^\./, ''); // strip a leading dot
            var a = s.split('.');
            for (var i = 0, n = a.length; i < n; ++i) {
                var k = a[i];
                if (k in o) {
                    o = o[k];
                }
                else {
                    return;
                }
            }
            return o;
        }
        catch (e) {
            return null;
        }
    };
}
//# sourceMappingURL=object.js.map