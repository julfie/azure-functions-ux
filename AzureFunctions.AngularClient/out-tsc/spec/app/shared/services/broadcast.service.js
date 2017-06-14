"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var broadcast_event_1 = require("../models/broadcast-event");
var BroadcastService = (function () {
    function BroadcastService() {
        this.dirtyStateMap = {};
        this.defaultDirtyReason = 'global';
        this.functionDeletedEvent = new core_1.EventEmitter();
        this.functionAddedEvent = new core_1.EventEmitter();
        this.functionSelectedEvent = new core_1.EventEmitter();
        this.functionUpdatedEvent = new core_1.EventEmitter();
        this.tutorialStepEvent = new core_1.EventEmitter();
        this.integrateChangedEvent = new core_1.EventEmitter();
        this.errorEvent = new core_1.EventEmitter();
        this.versionUpdated = new core_1.EventEmitter();
        this.trialExpired = new core_1.EventEmitter();
        this.functionNewEvent = new core_1.EventEmitter();
        this.resetKeySelection = new core_1.EventEmitter();
        this.refreshPortal = new core_1.EventEmitter();
        this.apiProxyAddedEvent = new core_1.EventEmitter();
        this.apiProxyDeletedEvent = new core_1.EventEmitter();
        this.apiProxySelectedEvent = new core_1.EventEmitter();
        this.apiProxyUpdatedEvent = new core_1.EventEmitter();
        this.clearErrorEvent = new core_1.EventEmitter();
    }
    BroadcastService.prototype.broadcast = function (eventType, obj) {
        var emitter = this.getEventEmitter(eventType);
        emitter.emit(obj);
    };
    BroadcastService.prototype.subscribe = function (eventType, callback, errorCallback, completedCallback) {
        var emitter = this.getEventEmitter(eventType);
        return emitter.subscribe(callback, errorCallback, completedCallback);
    };
    BroadcastService.prototype.setDirtyState = function (reason) {
        reason = reason || this.defaultDirtyReason;
        if (this.dirtyStateMap[reason]) {
            this.dirtyStateMap[reason]++;
        }
        else {
            this.dirtyStateMap[reason] = 1;
        }
    };
    BroadcastService.prototype.clearDirtyState = function (reason, all) {
        reason = reason || this.defaultDirtyReason;
        if (!this.dirtyStateMap[reason])
            return;
        if (all) {
            delete this.dirtyStateMap[reason];
        }
        else {
            this.dirtyStateMap[reason]--;
        }
    };
    BroadcastService.prototype.getDirtyState = function (reason) {
        if (reason) {
            return (this.dirtyStateMap[reason] || 0) > 0;
        }
        else {
            return this.isEmptyMap(this.dirtyStateMap);
        }
    };
    BroadcastService.prototype.clearAllDirtyStates = function () {
        this.dirtyStateMap = {};
    };
    // http://stackoverflow.com/a/20494546/3234163
    BroadcastService.prototype.isEmptyMap = function (map) {
        for (var key in map) {
            if (map.hasOwnProperty(key)) {
                return false;
            }
        }
        return true;
    };
    BroadcastService.prototype.getEventEmitter = function (eventType) {
        switch (eventType) {
            case broadcast_event_1.BroadcastEvent.FunctionDeleted:
                return this.functionDeletedEvent;
            case broadcast_event_1.BroadcastEvent.FunctionAdded:
                return this.functionAddedEvent;
            case broadcast_event_1.BroadcastEvent.FunctionSelected:
                return this.functionSelectedEvent;
            case broadcast_event_1.BroadcastEvent.FunctionUpdated:
                return this.functionUpdatedEvent;
            case broadcast_event_1.BroadcastEvent.TutorialStep:
                return this.tutorialStepEvent;
            case broadcast_event_1.BroadcastEvent.IntegrateChanged:
                return this.integrateChangedEvent;
            case broadcast_event_1.BroadcastEvent.Error:
                return this.errorEvent;
            case broadcast_event_1.BroadcastEvent.VersionUpdated:
                return this.versionUpdated;
            case broadcast_event_1.BroadcastEvent.TrialExpired:
                return this.trialExpired;
            case broadcast_event_1.BroadcastEvent.ResetKeySelection:
                return this.resetKeySelection;
            case broadcast_event_1.BroadcastEvent.RefreshPortal:
                return this.refreshPortal;
            case broadcast_event_1.BroadcastEvent.ApiProxyAdded:
                return this.apiProxyAddedEvent;
            case broadcast_event_1.BroadcastEvent.ApiProxyDeleted:
                return this.apiProxyDeletedEvent;
            case broadcast_event_1.BroadcastEvent.ApiProxySelected:
                return this.apiProxySelectedEvent;
            case broadcast_event_1.BroadcastEvent.ApiProxyUpdated:
                return this.apiProxyUpdatedEvent;
            case broadcast_event_1.BroadcastEvent.ClearError:
                return this.clearErrorEvent;
        }
    };
    return BroadcastService;
}());
BroadcastService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [])
], BroadcastService);
exports.BroadcastService = BroadcastService;
//# sourceMappingURL=broadcast.service.js.map