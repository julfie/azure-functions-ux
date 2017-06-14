"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var binding_1 = require("./binding");
var BindingInputList = (function () {
    function BindingInputList() {
        this.inputs = [];
        this.originInputs = [];
        this.leftInputs = [];
        this.rightInputs = [];
    }
    BindingInputList.prototype.saveOriginInputs = function () {
        this.originInputs = JSON.parse(JSON.stringify(this.inputs));
        this.orderInputs();
    };
    BindingInputList.prototype.orderInputs = function () {
        var _this = this;
        this.rightInputs = [];
        this.leftInputs = [];
        var pushLeft = true;
        this.inputs.forEach(function (input, index) {
            if (!input.isHidden) {
                if (pushLeft) {
                    _this.leftInputs.push(input);
                }
                else {
                    _this.rightInputs.push(input);
                }
                pushLeft = !pushLeft;
            }
        });
    };
    BindingInputList.prototype.isDirty = function () {
        for (var i = 0; i < this.inputs.length; i++) {
            if (this.inputs[i].type === binding_1.SettingType.checkBoxList) {
                var checkBoxList = this.inputs[i];
                var origcheckBoxList = this.originInputs[i];
                if (!checkBoxList.isEqual(origcheckBoxList)) {
                    return true;
                }
            }
            else {
                if (this.inputs[i].value !== this.originInputs[i].value) {
                    return true;
                }
            }
        }
        return false;
    };
    BindingInputList.prototype.isValid = function () {
        var result = true;
        this.inputs.forEach(function (input) {
            if (!input.isValid) {
                result = false;
            }
        });
        return result;
    };
    BindingInputList.prototype.discard = function () {
        this.inputs = JSON.parse(JSON.stringify(this.originInputs));
        this.saveOriginInputs();
    };
    BindingInputList.prototype.getInput = function (id) {
        return this.inputs.find(function (i) {
            return i.id === id;
        });
    };
    return BindingInputList;
}());
exports.BindingInputList = BindingInputList;
//# sourceMappingURL=binding-input-list.js.map