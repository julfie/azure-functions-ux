"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var app_module_1 = require("./../../app.module");
/* tslint:disable:no-unused-variable */
var testing_1 = require("@angular/core/testing");
var utilities_service_1 = require("./utilities.service");
describe('Service: Utilities', function () {
    beforeEach(function () {
        testing_1.TestBed.configureTestingModule(app_module_1.AppModule.moduleDefinition);
    });
    it('should ...', testing_1.inject([utilities_service_1.UtilitiesService], function (service) {
        expect(service).toBeTruthy();
    }));
});
//# sourceMappingURL=utilities.service.spec.js.map