"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var app_module_1 = require("./../../app.module");
/* tslint:disable:no-unused-variable */
var testing_1 = require("@angular/core/testing");
var broadcast_service_1 = require("./broadcast.service");
describe('Service: Broadcast', function () {
    beforeEach(function () {
        testing_1.TestBed.configureTestingModule(app_module_1.AppModule.moduleDefinition);
    });
    it('should ...', testing_1.inject([broadcast_service_1.BroadcastService], function (service) {
        expect(service).toBeTruthy();
    }));
});
//# sourceMappingURL=broadcast.service.spec.js.map