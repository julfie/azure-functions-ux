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
var http_run_1 = require("../shared/models/http-run");
var binding_1 = require("../shared/models/binding");
var core_2 = require("@ngx-translate/core");
var constants_1 = require("../shared/models/constants");
var http_1 = require("@angular/http");
var RunHttpComponent = (function () {
    function RunHttpComponent(_translateService) {
        this._translateService = _translateService;
        this.validChange = new core_1.EventEmitter();
        this.disableTestData = new core_1.EventEmitter();
        this.model = new http_run_1.HttpRunModel();
        this.availableMethods = [];
    }
    Object.defineProperty(RunHttpComponent.prototype, "functionInfo", {
        set: function (value) {
            var _this = this;
            this.model = undefined;
            if (value.test_data) {
                try {
                    this.model = JSON.parse(value.test_data);
                    // Check if it's valid model
                    if (!Array.isArray(this.model.headers)) {
                        this.model = undefined;
                    }
                }
                catch (e) {
                    this.model = undefined;
                }
            }
            var httpTrigger = value.config.bindings.find(function (b) {
                return b.type === binding_1.BindingType.httpTrigger.toString();
            });
            this.availableMethods = [];
            if (httpTrigger.methods) {
                httpTrigger.methods.forEach(function (m) {
                    _this.availableMethods.push(m);
                });
            }
            else {
                this.availableMethods = [
                    constants_1.Constants.httpMethods.POST,
                    constants_1.Constants.httpMethods.GET,
                    constants_1.Constants.httpMethods.DELETE,
                    constants_1.Constants.httpMethods.HEAD,
                    constants_1.Constants.httpMethods.PATCH,
                    constants_1.Constants.httpMethods.PUT,
                    constants_1.Constants.httpMethods.OPTIONS,
                    constants_1.Constants.httpMethods.TRACE
                ];
            }
            if (this.model === undefined) {
                this.model = new http_run_1.HttpRunModel();
                this.model.method = constants_1.Constants.httpMethods.POST;
                this.model.body = value.test_data;
            }
            if (!this.model.method && this.availableMethods.length > 0) {
                this.model.method = this.availableMethods[0];
            }
            this.paramChanged();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RunHttpComponent.prototype, "functionInvokeUrl", {
        set: function (value) {
            var _this = this;
            if (value) {
                var params = this.getQueryParams(value);
                var pathParams = this.getPathParams(value);
                params = pathParams.concat(params);
                params.forEach(function (p) {
                    var findResult = _this.model.queryStringParams.find(function (qp) {
                        return qp.name === p.name;
                    });
                    if (!findResult) {
                        _this.model.queryStringParams.splice(0, 0, p);
                    }
                });
            }
        },
        enumerable: true,
        configurable: true
    });
    RunHttpComponent.prototype.removeQueryStringParam = function (index) {
        this.model.queryStringParams.splice(index, 1);
        this.paramChanged();
    };
    RunHttpComponent.prototype.removeHeader = function (index) {
        this.model.headers.splice(index, 1);
        this.paramChanged();
    };
    RunHttpComponent.prototype.addQueryStringParam = function () {
        this.model.queryStringParams.push({
            name: "",
            value: "",
        });
        this.paramChanged();
    };
    RunHttpComponent.prototype.addHeader = function () {
        this.model.headers.push({
            name: "",
            value: "",
        });
        this.paramChanged();
    };
    RunHttpComponent.prototype.paramChanged = function (event) {
        // iterate all params and set valid property depends of params name
        var _this = this;
        var regex = new RegExp("^$|[^A-Za-z0-9]");
        this.valid = true;
        this.model.queryStringParams.concat(this.model.headers).forEach((function (item) {
            item.valid = !regex.test(item.name);
            _this.valid = item.valid && _this.valid;
        }));
        this.validChange.emit(this.valid);
    };
    RunHttpComponent.prototype.onChangeMethod = function (method) {
        this.disableTestData.emit((method.toLowerCase() === 'get' ||
            method.toLowerCase() === 'delete' ||
            method.toLowerCase() === 'head' ||
            method.toLowerCase() === 'options'));
    };
    RunHttpComponent.prototype.getQueryParams = function (url) {
        var result = [];
        var urlCopy = url;
        // Remove path params
        var regExp = /\{([^}]+)\}/g;
        var matches = urlCopy.match(regExp);
        if (matches) {
            matches.forEach(function (m) {
                urlCopy = urlCopy.replace(m, "");
            });
        }
        var indexOf = urlCopy.indexOf('?');
        if (indexOf > 0) {
            var usp = new http_1.URLSearchParams(urlCopy.substring(indexOf + 1, urlCopy.length));
            usp.paramsMap.forEach(function (value, key) {
                value.forEach(function (v) {
                    result.push({
                        name: decodeURIComponent(key),
                        value: decodeURIComponent(v),
                        isFixed: true
                    });
                });
            });
        }
        return result;
    };
    RunHttpComponent.prototype.getPathParams = function (url) {
        var regExp = /\{([^}]+)\}/g;
        var matches = url.match(regExp);
        var result = [];
        if (matches) {
            matches.forEach(function (m) {
                var splitResult = m.split(":");
                result.push({
                    name: splitResult[0].replace("{", "").replace("}", ""),
                    value: "",
                    isFixed: false
                });
            });
        }
        return result;
    };
    return RunHttpComponent;
}());
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], RunHttpComponent.prototype, "validChange", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], RunHttpComponent.prototype, "disableTestData", void 0);
RunHttpComponent = __decorate([
    core_1.Component({
        selector: 'run-http',
        templateUrl: './run-http.component.html',
        styleUrls: ['./run-http.component.scss', '../function-dev/function-dev.component.scss'],
        inputs: ['functionInfo', 'functionInvokeUrl']
    }),
    __metadata("design:paramtypes", [core_2.TranslateService])
], RunHttpComponent);
exports.RunHttpComponent = RunHttpComponent;
//# sourceMappingURL=run-http.component.js.map