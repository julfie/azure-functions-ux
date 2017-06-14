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
var Subject_1 = require("rxjs/Subject");
var forms_1 = require("@angular/forms");
var core_1 = require("@angular/core");
var DropDownComponent = (function () {
    function DropDownComponent() {
        this.blur = new Subject_1.Subject();
        this.value = new core_1.EventEmitter();
    }
    DropDownComponent.prototype.ngOnInit = function () {
        if (this.group && this.name) {
            this.control = this.group.controls[this.name];
        }
    };
    Object.defineProperty(DropDownComponent.prototype, "options", {
        set: function (value) {
            this._options = [];
            for (var i = 0; i < value.length; i++) {
                this._options.push({
                    id: i,
                    displayLabel: value[i].displayLabel,
                    value: value[i].value,
                    default: value[i].default
                });
            }
            // If there is only 1, auto-select it
            if (this._options.find(function (d) { return d.default; })) {
                if (this.control) {
                    this.onSelectValue(this._options.find(function (d) { return d.default; }).value);
                }
                else {
                    this.onSelect(this._options.find(function (d) { return d.default; }).id.toString());
                }
            }
            else if (this._options.length > 0) {
                if (this.control) {
                    this.onSelectValue(this._options[0].value);
                }
                else {
                    this.onSelect(this._options[0].id.toString());
                }
            }
            else if (this._options.length === 0) {
                delete this.selectedElement;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DropDownComponent.prototype, "resetOnChange", {
        set: function (value) {
            delete this.selectedElement;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DropDownComponent.prototype, "selectedValue", {
        set: function (value) {
            if ((this.selectedElement.value !== value) && (value)) {
                this.onSelectValue(value);
            }
        },
        enumerable: true,
        configurable: true
    });
    DropDownComponent.prototype.onSelect = function (id) {
        var element = this._options.find(function (e) { return e.id.toString() === id; });
        this.selectedElement = element;
        this.value.emit(element.value);
    };
    DropDownComponent.prototype.onSelectValue = function (value) {
        var element = this._options.find(function (e) { return e.value === value; });
        this.selectedElement = element;
        this.value.emit(element.value);
    };
    DropDownComponent.prototype.onBlur = function (event) {
        this.blur.next(event);
    };
    DropDownComponent.prototype.focus = function () {
        var _this = this;
        if (this.selectInput) {
            setTimeout(function () {
                _this.selectInput.nativeElement.focus();
            });
        }
    };
    return DropDownComponent;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", forms_1.FormGroup)
], DropDownComponent.prototype, "group", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", forms_1.FormControl)
], DropDownComponent.prototype, "control", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], DropDownComponent.prototype, "name", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], DropDownComponent.prototype, "placeholder", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Boolean)
], DropDownComponent.prototype, "disabled", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", core_1.EventEmitter)
], DropDownComponent.prototype, "value", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], DropDownComponent.prototype, "blur", void 0);
__decorate([
    core_1.ViewChild('selectInput'),
    __metadata("design:type", Object)
], DropDownComponent.prototype, "selectInput", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Array),
    __metadata("design:paramtypes", [Array])
], DropDownComponent.prototype, "options", null);
__decorate([
    core_1.Input(),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [Object])
], DropDownComponent.prototype, "resetOnChange", null);
__decorate([
    core_1.Input(),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [Object])
], DropDownComponent.prototype, "selectedValue", null);
DropDownComponent = __decorate([
    core_1.Component({
        selector: 'drop-down',
        templateUrl: './drop-down.component.html',
        styleUrls: ['./drop-down.component.css']
    }),
    __metadata("design:paramtypes", [])
], DropDownComponent);
exports.DropDownComponent = DropDownComponent;
//# sourceMappingURL=drop-down.component.js.map