"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var platform_browser_1 = require("@angular/platform-browser");
var common_1 = require("@angular/common");
var TableFunctionMonitorPipe = (function () {
    function TableFunctionMonitorPipe(sanitized) {
        this.sanitized = sanitized;
        this.datePipe = new common_1.DatePipe("en-US");
        this.decimalPipe = new common_1.DecimalPipe("en-US");
    }
    TableFunctionMonitorPipe.prototype.transform = function (input, args) {
        var format = '';
        var parsedFloat = 0;
        var pipeArgs = args.split(':'); // used if multiple case items maps to a single format
        for (var i = 0; i < pipeArgs.length; i++) {
            pipeArgs[i] = pipeArgs[i].trim(' ');
        }
        switch (pipeArgs[0].toLowerCase()) {
            case 'text':
                return input;
            case 'icon':
                if (input.toLowerCase() === "completedsuccess") {
                    return this.sanitized.bypassSecurityTrustHtml("<i style=\"color: green\" class=\"fa fa-check success\"></i>");
                }
                if (input.toLowerCase() === "running") {
                    return this.sanitized.bypassSecurityTrustHtml("<i class=\"fa fa-ellipsis-h\" style=\"color: blue\" ></i>");
                }
                if (input.toLowerCase() === "neverfinished") {
                    return this.sanitized.bypassSecurityTrustHtml("<i style=\"color: orange\" class=\"fa fa-exclamation-circle\"></i>");
                }
                return this.sanitized.bypassSecurityTrustHtml("<i class=\"fa fa-times\" style=\"color: red\"></i>");
            case 'number':
                parsedFloat = !isNaN(parseFloat(input)) ? parseFloat(input) : 0;
                format = pipeArgs.length > 1 ? pipeArgs[1] : null;
                return "(" + this.decimalPipe.transform(Math.round(parsedFloat), format) + " ms)";
            case 'datetime':
                return moment.utc(input).from(moment.utc()); // converts the datetime to a diff from current datetime
            default:
                return input;
        }
    };
    return TableFunctionMonitorPipe;
}());
TableFunctionMonitorPipe = __decorate([
    core_1.Pipe({
        name: 'format'
    }),
    __metadata("design:paramtypes", [platform_browser_1.DomSanitizer])
], TableFunctionMonitorPipe);
exports.TableFunctionMonitorPipe = TableFunctionMonitorPipe;
//# sourceMappingURL=table-function-monitor.pipe.js.map