"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var app_module_1 = require("./../../app.module");
/* tslint:disable:no-unused-variable */
var testing_1 = require("@angular/core/testing");
var function_monitor_service_1 = require("./function-monitor.service");
describe('Service: FunctionMonitor', function () {
    beforeEach(function () {
        testing_1.TestBed.configureTestingModule(app_module_1.AppModule.moduleDefinition);
    });
    it('should ...', testing_1.inject([function_monitor_service_1.FunctionMonitorService], function (service) {
        expect(service).toBeTruthy();
    }));
});
//# sourceMappingURL=function-monitor.service.spec.js.map