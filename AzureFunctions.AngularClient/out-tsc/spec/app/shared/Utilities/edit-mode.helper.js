"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var function_app_edit_mode_1 = require("app/shared/models/function-app-edit-mode");
var EditModeHelper = (function () {
    function EditModeHelper() {
    }
    EditModeHelper.isReadOnly = function (editMode) {
        return editMode === function_app_edit_mode_1.FunctionAppEditMode.ReadOnly ||
            editMode === function_app_edit_mode_1.FunctionAppEditMode.ReadOnlySourceControlled ||
            editMode === function_app_edit_mode_1.FunctionAppEditMode.ReadOnlySlots;
    };
    return EditModeHelper;
}());
exports.EditModeHelper = EditModeHelper;
//# sourceMappingURL=edit-mode.helper.js.map