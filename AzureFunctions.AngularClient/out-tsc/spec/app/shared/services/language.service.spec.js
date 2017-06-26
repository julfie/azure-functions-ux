"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var app_module_1 = require("./../../app.module");
/* tslint:disable:no-unused-variable */
var testing_1 = require("@angular/core/testing");
var language_service_1 = require("./language.service");
describe('Service: Language', function () {
    beforeEach(function () {
        testing_1.TestBed.configureTestingModule(app_module_1.AppModule.moduleDefinition);
    });
    it('should ...', testing_1.inject([language_service_1.LanguageService], function (service) {
        expect(service).toBeTruthy();
    }));
});
//# sourceMappingURL=language.service.spec.js.map