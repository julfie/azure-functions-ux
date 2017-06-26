"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Used to check if a value is unique in an array of controls.  The layout
 * of controls must be like so in order for it to work:
 * FormArray
 *       FormGroup's
 *           FormControl's
 *
 * When you instantiate the validator, the "_controlName" property is used to index
 * into another FormGroup in the array to compare whether it contains a duplicate
 * value or not
 */
var UniqueValidator = (function () {
    function UniqueValidator(_controlName, _controlsArray, _error) {
        this._controlName = _controlName;
        this._controlsArray = _controlsArray;
        this._error = _error;
    }
    UniqueValidator.prototype.validate = function (control) {
        var _this = this;
        if (control.pristine) {
            return null;
        }
        var match = this._controlsArray.controls.find(function (group) {
            var cs = group.controls;
            if (!cs) {
                throw "Validator requires hierarchy of FormArray -> FormGroup -> FormControl";
            }
            var c = cs[_this._controlName];
            return c !== control
                && c.value.toString().toLowerCase() === control.value.toString().toLowerCase();
        });
        return !!match ? { "notUnique": this._error } : null;
    };
    return UniqueValidator;
}());
exports.UniqueValidator = UniqueValidator;
//# sourceMappingURL=uniqueValidator.js.map