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
var Observable_1 = require("rxjs/Observable");
var Subject_1 = require("rxjs/Subject");
var core_2 = require("@ngx-translate/core");
var function_monitor_service_1 = require("../shared/services/function-monitor.service");
var global_state_service_1 = require("../shared/services/global-state.service");
var portal_service_1 = require("../shared/services/portal.service");
var portal_resources_1 = require("../shared/models/portal-resources");
var FunctionMonitorComponent = (function () {
    function FunctionMonitorComponent(_functionMonitorService, _portalService, _globalStateService, _translateService) {
        var _this = this;
        this._functionMonitorService = _functionMonitorService;
        this._portalService = _portalService;
        this._globalStateService = _globalStateService;
        this._translateService = _translateService;
        this.columns = [
            {
                display: this._translateService.instant(portal_resources_1.PortalResources.functionMonitorTable_functionColumn),
                variable: "functionDisplayTitle",
                formatTo: "text" // The type data for the column (date converts to fromNow etc)
            },
            {
                display: this._translateService.instant(portal_resources_1.PortalResources.functionMonitorTable_statusColumn),
                variable: "status",
                formatTo: "icon"
            },
            {
                display: this._translateService.instant(portal_resources_1.PortalResources.functionMonitorTable_detailsColumn),
                variable: "whenUtc",
                formatTo: "datetime"
            },
            {
                display: this._translateService.instant(portal_resources_1.PortalResources.functionMonitorTable_durationColumn),
                variable: "duration",
                formatTo: "number"
            }
        ];
        this.selectedFunctionStream = new Subject_1.Subject();
        this.selectedFunctionStream
            .switchMap(function (fi) {
            _this._globalStateService.setBusyState();
            // reset rows
            _this.rows = [];
            _this.currentFunction = fi;
            _this.successAggregate = _this.errorsAggregate = _this._translateService.instant(portal_resources_1.PortalResources.functionMonitor_loading);
            var site = fi.functionApp.getSiteName();
            _this.pulseUrl = "https://support-bay.scm.azurewebsites.net/Support.functionsmetrics/#/" + site + "/" + fi.name;
            var firstOfMonth = moment().startOf('month');
            _this.successAggregateHeading = _this._translateService.instant(portal_resources_1.PortalResources.functionMonitor_successAggregate) + " " + firstOfMonth.format("MMM Do");
            _this.errorsAggregateHeading = _this._translateService.instant(portal_resources_1.PortalResources.functionMonitor_errorsAggregate) + " " + firstOfMonth.format("MMM Do");
            var host = fi.functionApp.site.name;
            var hostId = !!host ? host : "";
            return fi.functionApp.getFunctionHostStatus()
                .flatMap(function (host) { return _this._functionMonitorService.getDataForSelectedFunction(fi, host.id); })
                .flatMap(function (data) {
                _this.functionId = !!data ? data.functionId : "";
                _this.successAggregate = !!data ? data.successCount.toString() : _this._translateService.instant(portal_resources_1.PortalResources.appMonitoring_noData);
                _this.errorsAggregate = !!data ? data.failedCount.toString() : _this._translateService.instant(portal_resources_1.PortalResources.appMonitoring_noData);
                return !!data
                    ? _this._functionMonitorService.getInvocationsDataForSelectedFunction(fi.functionApp, _this.functionId)
                    : Observable_1.Observable.of([]);
            });
        })
            .do(null, function (e) { return _this._globalStateService.clearBusyState(); })
            .retry()
            .subscribe(function (result) {
            _this.rows = result;
            _this._globalStateService.clearBusyState();
        }, null, function () { return _this._globalStateService.clearBusyState(); });
    }
    Object.defineProperty(FunctionMonitorComponent.prototype, "selectedFunction", {
        set: function (value) {
            this.selectedFunctionStream.next(value);
        },
        enumerable: true,
        configurable: true
    });
    FunctionMonitorComponent.prototype.ngOnDestroy = function () {
        if (this.selectedFunctionStream) {
            this.selectedFunctionStream.complete();
            this.selectedFunctionStream.unsubscribe();
            this.selectedFunctionStream = null;
        }
    };
    return FunctionMonitorComponent;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [Object])
], FunctionMonitorComponent.prototype, "selectedFunction", null);
FunctionMonitorComponent = __decorate([
    core_1.Component({
        selector: 'function-monitor',
        templateUrl: './function-monitor.component.html',
        styleUrls: ['./function-monitor.component.css']
    }),
    __metadata("design:paramtypes", [function_monitor_service_1.FunctionMonitorService,
        portal_service_1.PortalService,
        global_state_service_1.GlobalStateService,
        core_2.TranslateService])
], FunctionMonitorComponent);
exports.FunctionMonitorComponent = FunctionMonitorComponent;
//# sourceMappingURL=function-monitor.component.js.map