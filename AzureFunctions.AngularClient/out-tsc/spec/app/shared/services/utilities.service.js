"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var UtilitiesService = (function () {
    function UtilitiesService() {
    }
    //http://stackoverflow.com/q/8019534/3234163
    UtilitiesService.prototype.highlightText = function (e) {
        var range = document.createRange();
        range.selectNodeContents(e);
        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
    };
    UtilitiesService.prototype.unHighlightText = function () {
        var sel = window.getSelection();
        sel.removeAllRanges();
    };
    //https://www.reddit.com/r/web_design/comments/33kxgf/javascript_copying_to_clipboard_is_easier_than
    UtilitiesService.prototype.copyContentToClipboard = function (text) {
        var textField = document.createElement('textarea');
        textField.innerText = text;
        document.body.appendChild(textField);
        textField.select();
        document.execCommand('copy');
        textField.remove();
    };
    return UtilitiesService;
}());
UtilitiesService = __decorate([
    core_1.Injectable()
], UtilitiesService);
exports.UtilitiesService = UtilitiesService;
//# sourceMappingURL=utilities.service.js.map