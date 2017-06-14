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
var config_service_1 = require("./../shared/services/config.service");
var core_1 = require("@angular/core");
var Observable_1 = require("rxjs/Observable");
var Subject_1 = require("rxjs/Subject");
require("rxjs/add/operator/do");
require("rxjs/add/operator/retry");
require("rxjs/add/operator/switchMap");
require("rxjs/add/observable/of");
var ai_service_1 = require("./../shared/services/ai.service");
var dashboard_type_1 = require("../tree-view/models/dashboard-type");
var CreateFunctionWrapperComponent = (function () {
    function CreateFunctionWrapperComponent(_aiService, _configService) {
        var _this = this;
        this._aiService = _aiService;
        this._configService = _configService;
        this._viewInfoStream = new Subject_1.Subject();
        var initialDashboardType;
        this._subscription = this._viewInfoStream
            .switchMap(function (info) {
            _this.viewInfo = info;
            if (info.dashboardType === dashboard_type_1.DashboardType.createFunction
                || info.dashboardType === dashboard_type_1.DashboardType.createFunctionQuickstart) {
                _this.dashboardType = dashboard_type_1.DashboardType[info.dashboardType];
                return Observable_1.Observable.of(null);
            }
            // Set default for autodetect to CreateFunction while we load function list
            _this.dashboardType = dashboard_type_1.DashboardType[dashboard_type_1.DashboardType.createFunction];
            var appNode = info.node.parent;
            return appNode.functionAppStream;
        })
            .switchMap(function (functionApp) {
            if (!functionApp) {
                return Observable_1.Observable.of(null);
            }
            return functionApp.getFunctions();
        })
            .do(null, function (e) {
            _this._aiService.trackException(e, '/errors/create-function-wrapper');
        })
            .retry()
            .subscribe(function (fcs) {
            if (!fcs) {
                return;
            }
            if (fcs.length > 0 || _this._configService.isStandalone()) {
                _this.dashboardType = dashboard_type_1.DashboardType[dashboard_type_1.DashboardType.createFunction];
            }
            else {
                _this.dashboardType = dashboard_type_1.DashboardType[dashboard_type_1.DashboardType.createFunctionQuickstart];
            }
        });
    }
    Object.defineProperty(CreateFunctionWrapperComponent.prototype, "viewInfoInput", {
        set: function (viewInfo) {
            this._viewInfoStream.next(viewInfo);
        },
        enumerable: true,
        configurable: true
    });
    CreateFunctionWrapperComponent.prototype.ngOnInit = function () {
    };
    CreateFunctionWrapperComponent.prototype.ngOnDestroy = function () {
        if (this._subscription) {
            this._subscription.unsubscribe();
            this._subscription = null;
        }
    };
    return CreateFunctionWrapperComponent;
}());
CreateFunctionWrapperComponent = __decorate([
    core_1.Component({
        selector: 'create-function-wrapper',
        templateUrl: './create-function-wrapper.component.html',
        styleUrls: ['./create-function-wrapper.component.scss'],
        inputs: ['viewInfoInput']
    }),
    __metadata("design:paramtypes", [ai_service_1.AiService,
        config_service_1.ConfigService])
], CreateFunctionWrapperComponent);
exports.CreateFunctionWrapperComponent = CreateFunctionWrapperComponent;
//# sourceMappingURL=create-function-wrapper.component.js.map