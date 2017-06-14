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
var function_monitor_service_1 = require("../shared/services/function-monitor.service");
var core_2 = require("@ngx-translate/core");
var global_state_service_1 = require("../shared/services/global-state.service");
var busy_state_component_1 = require("../busy-state/busy-state.component");
var TableFunctionMonitorComponent = (function () {
    function TableFunctionMonitorComponent(_functionMonitorService, _translateService, globalStateService) {
        this._functionMonitorService = _functionMonitorService;
        this._translateService = _translateService;
        this.globalStateService = globalStateService;
    }
    TableFunctionMonitorComponent.prototype.showDetails = function (rowData) {
        var _this = this;
        this._functionMonitorService.getInvocationDetailsForSelectedInvocation(this.selectedFunction.functionApp, rowData.id)
            .subscribe(function (results) {
            if (!!results) {
                _this.invocation = results.invocation;
                _this.details = results.parameters;
                _this.selectedRowId = rowData.id;
                _this.setOutputLogInfo(_this.selectedRowId);
            }
        });
        return this.details;
    };
    TableFunctionMonitorComponent.prototype.setOutputLogInfo = function (rowId) {
        var _this = this;
        this._functionMonitorService.getOutputDetailsForSelectedInvocation(this.selectedFunction.functionApp, rowId)
            .subscribe(function (outputData) {
            _this.outputLog = outputData;
        });
    };
    TableFunctionMonitorComponent.prototype.ngOnChanges = function (changes) {
        this.details = null;
        this.outputLog = "";
        this.selectedRowId = null;
    };
    TableFunctionMonitorComponent.prototype.refreshFuncMonitorGridData = function () {
        var _this = this;
        this.setBusyState();
        this._functionMonitorService.getInvocationsDataForSelectedFunction(this.selectedFunction.functionApp, this.selectedFuncId)
            .subscribe(function (result) {
            _this.data = result;
            _this.clearBusyState();
        });
    };
    TableFunctionMonitorComponent.prototype.setBusyState = function () {
        if (this.busyState)
            this.busyState.setBusyState();
    };
    TableFunctionMonitorComponent.prototype.clearBusyState = function () {
        if (this.busyState)
            this.busyState.clearBusyState();
    };
    return TableFunctionMonitorComponent;
}());
__decorate([
    core_1.ViewChild(busy_state_component_1.BusyStateComponent),
    __metadata("design:type", busy_state_component_1.BusyStateComponent)
], TableFunctionMonitorComponent.prototype, "busyState", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Array)
], TableFunctionMonitorComponent.prototype, "columns", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Array)
], TableFunctionMonitorComponent.prototype, "data", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], TableFunctionMonitorComponent.prototype, "details", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], TableFunctionMonitorComponent.prototype, "invocation", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], TableFunctionMonitorComponent.prototype, "pulseUrl", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], TableFunctionMonitorComponent.prototype, "selectedFuncId", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], TableFunctionMonitorComponent.prototype, "selectedFunction", void 0);
TableFunctionMonitorComponent = __decorate([
    core_1.Component({
        selector: 'table-function-monitor',
        templateUrl: './table-function-monitor.component.html',
        styleUrls: ['./table-function-monitor.component.scss'],
    }),
    __metadata("design:paramtypes", [function_monitor_service_1.FunctionMonitorService,
        core_2.TranslateService,
        global_state_service_1.GlobalStateService])
], TableFunctionMonitorComponent);
exports.TableFunctionMonitorComponent = TableFunctionMonitorComponent;
//# sourceMappingURL=table-function-monitor.component.js.map