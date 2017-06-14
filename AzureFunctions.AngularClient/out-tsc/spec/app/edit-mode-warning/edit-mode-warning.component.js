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
var app_node_1 = require("./../tree-view/app-node");
var function_app_1 = require("./../shared/function-app");
var core_1 = require("@angular/core");
var function_app_edit_mode_1 = require("../shared/models/function-app-edit-mode");
var EditModeWarningComponent = (function () {
    function EditModeWarningComponent() {
        this.readOnly = false;
        this.readOnlySourceControlled = false;
        this.readWriteSourceControlled = false;
        this.readOnlySlots = false;
    }
    EditModeWarningComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.functionApp
            .getFunctionAppEditMode()
            .subscribe(function (editMode) {
            if (editMode === function_app_edit_mode_1.FunctionAppEditMode.ReadOnly) {
                _this.readOnly = true;
            }
            else if (editMode === function_app_edit_mode_1.FunctionAppEditMode.ReadOnlySourceControlled) {
                _this.readOnlySourceControlled = true;
            }
            else if (editMode === function_app_edit_mode_1.FunctionAppEditMode.ReadWriteSourceControlled) {
                _this.readWriteSourceControlled = true;
            }
            else if (editMode === function_app_edit_mode_1.FunctionAppEditMode.ReadOnlySlots) {
                _this.readOnlySlots = true;
            }
        });
    };
    EditModeWarningComponent.prototype.onFunctionAppSettingsClicked = function () {
        this.appNode.openSettings();
    };
    return EditModeWarningComponent;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", function_app_1.FunctionApp)
], EditModeWarningComponent.prototype, "functionApp", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", app_node_1.AppNode)
], EditModeWarningComponent.prototype, "appNode", void 0);
EditModeWarningComponent = __decorate([
    core_1.Component({
        selector: 'app-edit-mode-warning',
        templateUrl: './edit-mode-warning.component.html',
        styleUrls: ['./edit-mode-warning.component.scss']
    })
], EditModeWarningComponent);
exports.EditModeWarningComponent = EditModeWarningComponent;
//# sourceMappingURL=edit-mode-warning.component.js.map