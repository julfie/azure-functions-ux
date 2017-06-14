"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SwaggerEditor = (function () {
    function SwaggerEditor(editor, zone) {
        this.editor = editor;
        this.zone = zone;
    }
    SwaggerEditor.prototype.getDocument = function (callback) {
        var _this = this;
        this.editor.getDocument(function (arg, error) {
            _this.zone.run(function () { return callback(arg, error); });
        });
    };
    SwaggerEditor.prototype.setDocument = function (swaggerObject) {
        var _this = this;
        this.zone.run(function () {
            _this.editor.setDocument(swaggerObject);
        });
    };
    return SwaggerEditor;
}());
exports.SwaggerEditor = SwaggerEditor;
//# sourceMappingURL=swaggerEditor.js.map