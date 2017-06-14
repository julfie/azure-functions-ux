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
require("rxjs/add/operator/switchMap");
var core_2 = require("@ngx-translate/core");
var portal_service_1 = require("../shared/services/portal.service");
var user_service_1 = require("../shared/services/user.service");
var function_dev_component_1 = require("../function-dev/function-dev.component");
var broadcast_service_1 = require("../shared/services/broadcast.service");
var broadcast_event_1 = require("../shared/models/broadcast-event");
var tutorial_1 = require("../shared/models/tutorial");
var FunctionEditComponent = (function () {
    function FunctionEditComponent(_userService, _broadcastService, _portalService, _translateService) {
        var _this = this;
        this._userService = _userService;
        this._broadcastService = _broadcastService;
        this._portalService = _portalService;
        this._translateService = _translateService;
        this.editorType = "standard";
        this.tabId = "";
        this.inIFrame = this._userService.inIFrame;
        this.DevelopTab = _translateService.instant("tabNames_develop");
        this.IntegrateTab = _translateService.instant("tabNames_integrate");
        this.MonitorTab = _translateService.instant("tabNames_monitor");
        this.ManageTab = _translateService.instant("tabNames_manage");
        this._viewInfoStream = new Subject_1.Subject();
        this._viewInfoStream
            .subscribe(function (viewInfo) {
            _this.viewInfo = viewInfo;
            _this.selectedFunction = viewInfo.node.functionInfo;
            _this.functionApp = _this.selectedFunction.functionApp;
            _this.appNode = viewInfo.node.parent.parent;
            var segments = viewInfo.resourceId.split("/");
            // support for both site & slots
            if (segments.length === 13 && segments[11] === "functions" || segments.length === 11 && segments[9] === "functions") {
                _this.tabId = "develop";
            }
            else {
                _this.tabId = segments[segments.length - 1];
            }
        });
    }
    Object.defineProperty(FunctionEditComponent.prototype, "viewInfoInput", {
        set: function (viewInfo) {
            this._viewInfoStream.next(viewInfo);
        },
        enumerable: true,
        configurable: true
    });
    FunctionEditComponent.prototype.ngAfterContentInit = function () {
        this._broadcastService.broadcast(broadcast_event_1.BroadcastEvent.TutorialStep, {
            functionInfo: null,
            step: tutorial_1.TutorialStep.Develop
        });
    };
    FunctionEditComponent.prototype.onEditorChange = function (editorType) {
        this._portalService.logAction("function-edit", "switchEditor", { type: editorType });
        this.editorType = editorType;
    };
    return FunctionEditComponent;
}());
__decorate([
    core_1.ViewChild(function_dev_component_1.FunctionDevComponent),
    __metadata("design:type", function_dev_component_1.FunctionDevComponent)
], FunctionEditComponent.prototype, "functionDevComponent", void 0);
FunctionEditComponent = __decorate([
    core_1.Component({
        selector: 'function-edit',
        templateUrl: './function-edit.component.html',
        styleUrls: ['./function-edit.component.css'],
        inputs: ['viewInfoInput']
    }),
    __metadata("design:paramtypes", [user_service_1.UserService,
        broadcast_service_1.BroadcastService,
        portal_service_1.PortalService,
        core_2.TranslateService])
], FunctionEditComponent);
exports.FunctionEditComponent = FunctionEditComponent;
//# sourceMappingURL=function-edit.component.js.map