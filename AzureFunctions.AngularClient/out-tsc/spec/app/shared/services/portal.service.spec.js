"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var app_module_1 = require("./../../app.module");
/* tslint:disable:no-unused-variable */
var testing_1 = require("@angular/core/testing");
var portal_service_1 = require("./portal.service");
describe('Service: Portal', function () {
    beforeEach(function () {
        testing_1.TestBed.configureTestingModule(app_module_1.AppModule.moduleDefinition);
    });
    it('should ...', testing_1.inject([portal_service_1.PortalService], function (service) {
        expect(service).toBeTruthy();
    }));
});
//# sourceMappingURL=portal.service.spec.js.map