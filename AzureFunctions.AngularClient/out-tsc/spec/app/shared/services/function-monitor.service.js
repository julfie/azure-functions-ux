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
var http_1 = require("@angular/http");
var core_1 = require("@angular/core");
var Observable_1 = require("rxjs/Observable");
require("rxjs/add/operator/catch");
require("rxjs/add/operator/map");
require("rxjs/add/observable/of");
var user_service_1 = require("./user.service");
var global_state_service_1 = require("../services/global-state.service");
var FunctionMonitorService = (function () {
    function FunctionMonitorService(_userService, _http, _globalStateService) {
        var _this = this;
        this._userService = _userService;
        this._http = _http;
        this._globalStateService = _globalStateService;
        if (!this._globalStateService.showTryView) {
            this._userService.getStartupInfo().subscribe(function (info) { return _this.token = info.token; });
        }
    }
    FunctionMonitorService.prototype.getHeadersForScmSite = function (scmCreds) {
        var contentType = 'application/json';
        var headers = new http_1.Headers();
        headers.append('Content-Type', contentType);
        if (scmCreds) {
            headers.append('Authorization', "Basic " + scmCreds);
        }
        else if (this.token) {
            headers.append('Authorization', "Bearer " + this.token);
        }
        return headers;
    };
    FunctionMonitorService.prototype.getDataForSelectedFunction = function (functionInfo, host) {
        var url = functionInfo.functionApp.getScmUrl() + "/azurejobs/api/functions/definitions?host=" + host + "&limit=11";
        return this._http.get(url, {
            headers: this.getHeadersForScmSite(functionInfo.functionApp.tryFunctionsScmCreds)
        })
            .map(function (r) { return (r.json().entries.find(function (x) { return x.functionName.toLowerCase() === functionInfo.name.toLowerCase(); })); });
    };
    FunctionMonitorService.prototype.getInvocationsDataForSelectedFunction = function (functionApp, functionId) {
        var url = functionApp.getScmUrl() + "/azurejobs/api/functions/definitions/" + functionId + "/invocations?limit=20";
        return this._http.get(url, {
            headers: this.getHeadersForScmSite(functionApp.tryFunctionsScmCreds)
        })
            .map(function (r) { return r.json().entries; })
            .catch(function (e) { return Observable_1.Observable.of([]); });
    };
    FunctionMonitorService.prototype.getInvocationDetailsForSelectedInvocation = function (functionApp, invocationId) {
        var url = functionApp.getScmUrl() + "/azurejobs/api/functions/invocations/" + invocationId;
        return this._http.get(url, {
            headers: this.getHeadersForScmSite(functionApp.tryFunctionsScmCreds)
        })
            .map(function (r) { return r.json(); })
            .catch(function (e) { return Observable_1.Observable.of(null); });
    };
    FunctionMonitorService.prototype.getOutputDetailsForSelectedInvocation = function (functionApp, invocationId) {
        var url = functionApp.getScmUrl() + "/azurejobs/api/log/output/" + invocationId;
        return this._http.get(url, {
            headers: this.getHeadersForScmSite(functionApp.tryFunctionsScmCreds)
        })
            .map(function (r) { return r.text(); })
            .catch(function (e) { return Observable_1.Observable.of(""); });
    };
    return FunctionMonitorService;
}());
FunctionMonitorService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [user_service_1.UserService,
        http_1.Http,
        global_state_service_1.GlobalStateService])
], FunctionMonitorService);
exports.FunctionMonitorService = FunctionMonitorService;
//# sourceMappingURL=function-monitor.service.js.map