"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var app_module_1 = require("./../../app.module");
/* tslint:disable:no-unused-variable */
var testing_1 = require("@angular/core/testing");
var background_tasks_service_1 = require("./background-tasks.service");
describe('Service: BackgroundTasks', function () {
    beforeEach(function () {
        testing_1.TestBed.configureTestingModule(app_module_1.AppModule.moduleDefinition);
    });
    it('should ...', testing_1.inject([background_tasks_service_1.BackgroundTasksService], function (service) {
        expect(service).toBeTruthy();
    }));
});
//# sourceMappingURL=background-tasks.service.spec.js.map