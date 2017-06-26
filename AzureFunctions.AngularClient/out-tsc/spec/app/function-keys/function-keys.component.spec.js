"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var app_module_1 = require("./../app.module");
var ai_service_1 = require("./../shared/services/ai.service");
var utilities_service_1 = require("./../shared/services/utilities.service");
var core_1 = require("@ngx-translate/core");
var broadcast_service_1 = require("./../shared/services/broadcast.service");
/* tslint:disable:no-unused-variable */
var testing_1 = require("@angular/core/testing");
var function_keys_component_1 = require("./function-keys.component");
describe('FunctionKeysComponent', function () {
    var component;
    var fixture;
    var de;
    var broadcastService;
    var translateService;
    var utilitiesService;
    var aiService;
    beforeEach(testing_1.async(function () {
        testing_1.TestBed.configureTestingModule(app_module_1.AppModule.moduleDefinition)
            .compileComponents();
    }));
    beforeEach(function () {
        fixture = testing_1.TestBed.createComponent(function_keys_component_1.FunctionKeysComponent);
        component = fixture.componentInstance;
        de = fixture.debugElement;
        broadcastService = testing_1.TestBed.get(broadcast_service_1.BroadcastService);
        translateService = testing_1.TestBed.get(core_1.TranslateService);
        utilitiesService = testing_1.TestBed.get(utilities_service_1.UtilitiesService);
        aiService = testing_1.TestBed.get(ai_service_1.AiService);
        fixture.detectChanges();
    });
    it('should create', function () {
        expect(component).toBeTruthy();
    });
    it('should initialize state as expected', function () {
        expect(component['validKey']).toBeFalsy();
        expect(component.keys).toBeTruthy();
        expect(component['functionStream']).toBeTruthy();
        expect(component['functionAppStream']).toBeTruthy();
    });
    it('should handle new FunctionInfo getting pushed to it', function () {
        var functionAppStream = component['functionAppStream'];
        var functionStream = component['functionStream'];
        var functionApp = {
            getFunctionKeys: function (functionInfo) { return undefined; }
        };
        functionAppStream.next(functionApp);
        functionStream.next({
            functionApp: functionApp
        });
    });
});
//# sourceMappingURL=function-keys.component.spec.js.map