"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var app_module_1 = require("./../../app.module");
/* tslint:disable:no-unused-variable */
var testing_1 = require("@angular/core/testing");
var user_service_1 = require("./user.service");
describe('Service: User', function () {
    beforeEach(function () {
        testing_1.TestBed.configureTestingModule(app_module_1.AppModule.moduleDefinition);
    });
    it('should ...', testing_1.inject([user_service_1.UserService], function (service) {
        expect(service).toBeTruthy();
    }));
});
//# sourceMappingURL=user.service.spec.js.map