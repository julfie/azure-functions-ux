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
var ReplaySubject_1 = require("rxjs/ReplaySubject");
var MultiDropDownComponent = (function () {
    function MultiDropDownComponent(_eref) {
        this._eref = _eref;
        this.displayText = "";
        this.opened = false;
        this.selectedValues = new ReplaySubject_1.ReplaySubject(1);
        this._selectAllOption = {
            displayLabel: "Select All",
            value: null,
            isSelected: false
        };
    }
    MultiDropDownComponent.prototype.ngOnInit = function () {
    };
    Object.defineProperty(MultiDropDownComponent.prototype, "inputOptions", {
        set: function (inputOptions) {
            var options = [];
            var defaultSelected = false;
            inputOptions.forEach(function (option) {
                if (option.isSelected) {
                    defaultSelected = true;
                }
                options.push(option);
            });
            options.splice(0, 0, this._selectAllOption);
            this.options = options;
            if (!defaultSelected) {
                this._updateAllSelected(true);
            }
            this._notifyChangeSubscriptions();
        },
        enumerable: true,
        configurable: true
    });
    MultiDropDownComponent.prototype.click = function () {
        if (this.opened) {
            this._notifyChangeSubscriptions();
        }
        this.opened = !this.opened;
    };
    // http://stackoverflow.com/questions/35712379/angular2-close-dropdown-on-click-outside-is-there-an-easiest-way
    MultiDropDownComponent.prototype.onDocumentClick = function (event) {
        if (this.opened && !this._eref.nativeElement.contains(event.target)) {
            this.opened = false;
            this._notifyChangeSubscriptions();
        }
    };
    MultiDropDownComponent.prototype.handleChecked = function (option) {
        if (option !== this._selectAllOption) {
            this._selectAllOption.isSelected = false;
            option.isSelected = !option.isSelected;
        }
        else {
            this._updateAllSelected(!option.isSelected);
        }
    };
    MultiDropDownComponent.prototype._notifyChangeSubscriptions = function () {
        var _this = this;
        var displayText = null;
        var selectedValues = [];
        if (this.options) {
            this.options.forEach(function (option) {
                if (option.isSelected && option !== _this._selectAllOption) {
                    displayText = option.displayLabel;
                    selectedValues.push(option.value);
                }
            });
        }
        // Prevent user from selecting none.  It's an optimization specific
        // to subscriptions and may not make sense as a generic behavior.
        if (selectedValues.length === 0) {
            this.options.forEach(function (option) {
                option.isSelected = true;
                if (option !== _this._selectAllOption) {
                    selectedValues.push(option.value);
                }
            });
        }
        if (this._selectAllOption.isSelected) {
            displayText = "All items selected";
        }
        else if (selectedValues.length > 1) {
            displayText = selectedValues.length + " items selected";
        }
        this.displayText = displayText;
        this.selectedValues.next(selectedValues);
    };
    MultiDropDownComponent.prototype._updateAllSelected = function (allSelected) {
        this.options.forEach(function (option) {
            option.isSelected = allSelected;
        });
    };
    return MultiDropDownComponent;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], MultiDropDownComponent.prototype, "displayText", void 0);
MultiDropDownComponent = __decorate([
    core_1.Component({
        selector: 'multi-drop-down',
        templateUrl: './multi-drop-down.component.html',
        styleUrls: ['./multi-drop-down.component.scss'],
        inputs: ['inputOptions'],
        outputs: ['selectedValues'],
        host: {
            '(document:click)': 'onDocumentClick($event)',
        }
    }),
    __metadata("design:paramtypes", [core_1.ElementRef])
], MultiDropDownComponent);
exports.MultiDropDownComponent = MultiDropDownComponent;
//# sourceMappingURL=multi-drop-down.component.js.map