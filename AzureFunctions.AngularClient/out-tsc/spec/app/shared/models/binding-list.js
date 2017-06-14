"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var binding_1 = require("./binding");
var BindingList = (function () {
    function BindingList() {
        this.setBindings();
    }
    BindingList.prototype.setBindings = function () {
        if (!this.config) {
            return;
        }
        this.config.bindings.forEach(function (i) {
            i.title = i.name ? i.displayName + " (" + i.name + ")" : i.displayName;
        });
        this.trigger = this.config.bindings.find(function (binding, index) {
            return binding.direction === binding_1.DirectionType.trigger;
        });
        this.inputs = this.config.bindings.filter(function (binding, index) {
            return binding.direction === binding_1.DirectionType.in;
        });
        this.outputs = this.config.bindings.filter(function (binding, index) {
            return binding.direction === binding_1.DirectionType.out;
        });
        if (this.inputs.length === 0) {
            this.inputs = null;
        }
    };
    BindingList.prototype.getBinding = function (id) {
        return this.config.bindings.filter(function (binding, index) {
            return binding.id === id;
        })[0];
    };
    BindingList.prototype.removeBinding = function (id) {
        for (var i = this.config.bindings.length - 1; i >= 0; i--) {
            if (this.config.bindings[i].id === id) {
                this.config.bindings.splice(i, 1);
                break;
            }
        }
    };
    BindingList.prototype.updateBinding = function (binding) {
        var index = this.config.bindings.findIndex(function (b) {
            return binding.id === b.id;
        });
        if (index === -1) {
            this.config.bindings.push(binding);
        }
        else {
            this.config.bindings[index] = binding;
        }
    };
    return BindingList;
}());
exports.BindingList = BindingList;
//# sourceMappingURL=binding-list.js.map