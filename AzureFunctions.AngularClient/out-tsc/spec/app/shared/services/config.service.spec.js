"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var app_module_1 = require("./../../app.module");
/* tslint:disable:no-unused-variable */
var testing_1 = require("@angular/core/testing");
var config_service_1 = require("./config.service");
describe('Service: Config', function () {
    beforeEach(function () {
        testing_1.TestBed.configureTestingModule(app_module_1.AppModule.moduleDefinition);
    });
    it('should ...', testing_1.inject([config_service_1.ConfigService], function (service) {
        expect(service).toBeTruthy();
    }));
});
//# sourceMappingURL=config.service.spec.js.map