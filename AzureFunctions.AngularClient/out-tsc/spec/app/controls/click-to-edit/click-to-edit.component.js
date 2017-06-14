"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var drop_down_component_1 = require("./../../drop-down/drop-down.component");
var textbox_component_1 = require("./../textbox/textbox.component");
var forms_1 = require("@angular/forms");
var core_1 = require("@angular/core");
var Subject_1 = require("rxjs/Subject");
// Used to communicate between click-to-edit components
var CustomFormGroup = (function (_super) {
    __extends(CustomFormGroup, _super);
    function CustomFormGroup() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return CustomFormGroup;
}(forms_1.FormGroup));
exports.CustomFormGroup = CustomFormGroup;
var CustomFormControl = (function (_super) {
    __extends(CustomFormControl, _super);
    function CustomFormControl() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return CustomFormControl;
}(forms_1.FormControl));
exports.CustomFormControl = CustomFormControl;
var ClickToEditComponent = (function () {
    function ClickToEditComponent(_eref) {
        this._eref = _eref;
        this.showTextbox = false;
    }
    ClickToEditComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.control = this.group.controls[this.name];
        var group = this.group;
        if (!group._msShowTextbox) {
            group._msShowTextbox = new Subject_1.Subject();
        }
        this._sub = group._msShowTextbox.subscribe(function (showTextbox) {
            _this.showTextbox = showTextbox;
        });
        if (group._msStartInEditMode) {
            this.showTextbox = true;
        }
        if (this.textbox) {
            this.textbox.blur.subscribe(function (event) { return _this.onBlur(event); });
        }
        else if (this.dropdown) {
            this.dropdown.blur.subscribe(function (event) { return _this.onBlur(event); });
        }
    };
    ClickToEditComponent.prototype.ngOnDestroy = function () {
        if (this._sub) {
            this._sub.unsubscribe();
            this._sub = null;
        }
    };
    ClickToEditComponent.prototype.onClick = function (event) {
        if (!this.showTextbox) {
            if (this.textbox) {
                this.textbox.focus();
            }
            else if (this.dropdown) {
                this.dropdown.focus();
            }
        }
        this._updateShowTextbox(true);
    };
    ClickToEditComponent.prototype.onBlur = function (event) {
        var _this = this;
        this.control._msRunValidation = true;
        this.control.updateValueAndValidity();
        if (this.group.valid) {
            // Blur happens before click.  So if you're switching between
            // click-to-edit-textbox components in the same form group,
            // you want to make sure the click event on the target component
            // is able to change _azFocusedControl before you update showTextbox
            // on the source component.  Otherwise when you switch components
            // blur will remove the textbox and the click will never happen/
            setTimeout(function () {
                _this._updateShowTextbox(false);
            }, 100);
        }
    };
    ClickToEditComponent.prototype._updateShowTextbox = function (show) {
        var group = this.group;
        if (show) {
            group._msFocusedControl = this.name;
        }
        else if (group._msFocusedControl === this.name) {
            group._msFocusedControl = "";
        }
        if (!group._msFocusedControl || group._msFocusedControl === this.name) {
            group._msShowTextbox.next(show);
        }
    };
    return ClickToEditComponent;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", forms_1.FormGroup)
], ClickToEditComponent.prototype, "group", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], ClickToEditComponent.prototype, "name", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], ClickToEditComponent.prototype, "placeholder", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Boolean)
], ClickToEditComponent.prototype, "hiddenText", void 0);
__decorate([
    core_1.ContentChild(textbox_component_1.TextboxComponent),
    __metadata("design:type", textbox_component_1.TextboxComponent)
], ClickToEditComponent.prototype, "textbox", void 0);
__decorate([
    core_1.ContentChild(drop_down_component_1.DropDownComponent),
    __metadata("design:type", drop_down_component_1.DropDownComponent)
], ClickToEditComponent.prototype, "dropdown", void 0);
ClickToEditComponent = __decorate([
    core_1.Component({
        selector: 'click-to-edit',
        templateUrl: './click-to-edit.component.html',
        styleUrls: ['./click-to-edit.component.scss'],
    }),
    __metadata("design:paramtypes", [core_1.ElementRef])
], ClickToEditComponent);
exports.ClickToEditComponent = ClickToEditComponent;
//# sourceMappingURL=click-to-edit.component.js.map