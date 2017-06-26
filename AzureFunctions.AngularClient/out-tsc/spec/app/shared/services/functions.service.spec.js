"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var app_module_1 = require("./../../app.module");
/* tslint:disable:no-unused-variable */
var testing_1 = require("@angular/core/testing");
var functions_service_1 = require("./functions.service");
describe('Service: Functions', function () {
    beforeEach(function () {
        testing_1.TestBed.configureTestingModule(app_module_1.AppModule.moduleDefinition);
    });
    it('should ...', testing_1.inject([functions_service_1.FunctionsService], function (service) {
        expect(service).toBeTruthy();
    }));
});
//# sourceMappingURL=functions.service.spec.js.map