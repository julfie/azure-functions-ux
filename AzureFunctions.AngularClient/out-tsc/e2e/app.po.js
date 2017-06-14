"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var protractor_1 = require("protractor");
var AzureFunctionsClientPage = (function () {
    function AzureFunctionsClientPage() {
    }
    AzureFunctionsClientPage.prototype.navigateTo = function () {
        return protractor_1.browser.get('/');
    };
    AzureFunctionsClientPage.prototype.getParagraphText = function () {
        return protractor_1.element(protractor_1.by.css('app-root h1')).getText();
    };
    return AzureFunctionsClientPage;
}());
exports.AzureFunctionsClientPage = AzureFunctionsClientPage;
//# sourceMappingURL=app.po.js.map