// http://stackoverflow.com/questions/21293063/how-to-programmatically-enumerate-an-enum-type-in-typescript-0-9-5
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var EnumEx = (function () {
    function EnumEx() {
    }
    EnumEx.getNamesAndValues = function (e) {
        return EnumEx.getNames(e).map(function (n) { return ({ name: n, value: e[n] }); });
    };
    EnumEx.getNames = function (e) {
        return EnumEx.getObjValues(e).filter(function (v) { return typeof v === "string"; });
    };
    EnumEx.getValues = function (e) {
        return EnumEx.getObjValues(e).filter(function (v) { return typeof v === "number"; });
    };
    EnumEx.getObjValues = function (e) {
        return Object.keys(e).map(function (k) { return e[k]; });
    };
    return EnumEx;
}());
exports.EnumEx = EnumEx;
//# sourceMappingURL=enumEx.js.map