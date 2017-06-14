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
var Subject_1 = require("rxjs/Subject");
require("rxjs/add/operator/distinctUntilChanged");
require("rxjs/add/operator/mergeMap");
require("rxjs/add/operator/switchMap");
var cache_service_1 = require("../../shared/services/cache.service");
var arm_service_1 = require("../../shared/services/arm.service");
var deployment_1 = require("./deployment");
var global_state_service_1 = require("../../shared/services/global-state.service");
var DeploymentSourceComponent = (function () {
    function DeploymentSourceComponent(_cacheService, _globalStateService, _armService) {
        var _this = this;
        this._cacheService = _cacheService;
        this._globalStateService = _globalStateService;
        this._armService = _armService;
        this.Status = deployment_1.Status;
        this._maxRetries = 5;
        this._retries = 0;
        this._siteSubject = new Subject_1.Subject();
        this._siteSubject
            .distinctUntilChanged()
            .switchMap(function (site) {
            clearInterval(_this._timeoutId);
            _this.deployments = [];
            _this.site = site;
            _this._globalStateService.setBusyState();
            var configId = site.id + "/config/web";
            return _this._cacheService.getArm(configId);
        })
            .subscribe(function (r) {
            var config = r.json();
            _this._globalStateService.clearBusyState();
            _this.config = config;
            _this.loadingDeployments = true;
            if (config.properties.scmType !== "None") {
                _this._getDeployments();
            }
        });
    }
    Object.defineProperty(DeploymentSourceComponent.prototype, "siteInput", {
        set: function (site) {
            if (!site) {
                return;
            }
            this._siteSubject.next(site);
        },
        enumerable: true,
        configurable: true
    });
    DeploymentSourceComponent.prototype.expandDeployment = function (deployment) {
        var _this = this;
        this.deployment = deployment;
        this.logs = [];
        this.loadingLogs = true;
        this._cacheService.get(deployment.log_url)
            .subscribe(function (result) {
            _this.loadingLogs = false;
            _this.logs = result.json();
            _this.logs.forEach(function (log) {
                var date = new Date(log.log_time);
                log.log_time = _this._getTime(date.getHours(), date.getMinutes(), date.getSeconds());
            });
        });
    };
    DeploymentSourceComponent.prototype.collapseDeployment = function () {
        this.deployment = null;
    };
    DeploymentSourceComponent.prototype.ngOnDestroy = function () {
        clearTimeout(this._timeoutId);
    };
    DeploymentSourceComponent.prototype.updateConfig = function (config) {
        this.config = config;
        if (config.properties.scmType !== "None") {
            this.loadingDeployments = true;
            this._getDeployments();
        }
    };
    DeploymentSourceComponent.prototype.disconnect = function () {
        var _this = this;
        this._globalStateService.setBusyState();
        this._armService.delete(this.site.id + "/sourceControls/web")
            .mergeMap(function (result) {
            return _this._cacheService.getArm(_this.site.id + "/config/web", true);
        })
            .subscribe(function (r) {
            var config = r.json();
            _this._globalStateService.clearBusyState();
            _this.updateConfig(config);
        });
    };
    DeploymentSourceComponent.prototype._getDeployments = function () {
        var _this = this;
        var sslState = this.site.properties.hostNameSslStates.find(function (state) {
            return state.hostType === 1;
        });
        var url = "https://" + sslState.name + "/api/deployments?$orderby=ReceivedTime desc&$top=10";
        this._cacheService.get(url, true)
            .subscribe(function (result) {
            var deployments = result.json();
            deployments.forEach(function (deployment) {
                var date = new Date(deployment.end_time);
                // TODO: This probably isn't the right way to get a formatted date string, but it works for now.
                var dateStr = date.toString().slice(0, 15);
                var timeStr = _this._getTime(date.getHours(), date.getMinutes(), date.getSeconds());
                deployment.end_time = dateStr + " " + timeStr;
            });
            var curDeployments = JSON.stringify(_this.deployments);
            var newDeployments = JSON.stringify(deployments);
            if (curDeployments !== newDeployments) {
                _this.deployments = deployments;
            }
            if (_this.config.properties.scmType !== "None") {
                // Keep the loading icon spinning if keep getting an empty array.
                // This is because we know that there should be a deployment status
                // but we're waiting for Kudu to show an initial value
                if (deployments.length > 0 || _this._retries >= _this._maxRetries) {
                    _this._retries = 0;
                    _this.loadingDeployments = false;
                }
                else if (deployments.length === 0) {
                    _this._retries++;
                }
                _this._timeoutId = setTimeout(_this._getDeployments.bind(_this), 5000);
            }
        });
    };
    DeploymentSourceComponent.prototype._getTime = function (hours, mins, secs) {
        var h = hours.toString();
        var m = mins.toString();
        var s = secs.toString();
        var ampm = "AM";
        if (hours > 12) {
            hours = hours - 12;
            ampm = "PM";
        }
        if (hours < 10) {
            h = "0" + hours;
        }
        if (mins < 10) {
            m = "0" + mins;
        }
        if (secs < 10) {
            s = "0" + secs;
        }
        return h + ":" + m + ":" + s + " " + ampm;
    };
    return DeploymentSourceComponent;
}());
DeploymentSourceComponent = __decorate([
    core_1.Component({
        selector: 'deployment-source',
        templateUrl: './deployment-source.component.html',
        styleUrls: ['./deployment-source.component.scss'],
        inputs: ["siteInput"]
    }),
    __metadata("design:paramtypes", [cache_service_1.CacheService,
        global_state_service_1.GlobalStateService,
        arm_service_1.ArmService])
], DeploymentSourceComponent);
exports.DeploymentSourceComponent = DeploymentSourceComponent;
//# sourceMappingURL=deployment-source.component.js.map