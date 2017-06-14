"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var binding_1 = require("./binding");
var portal_resources_1 = require("./portal-resources");
var BindingManager = (function () {
    function BindingManager() {
    }
    BindingManager.getFunctionName = function (defaultName, functionsInfo) {
        var i = 1;
        while (true) {
            var func = functionsInfo.find(function (value) {
                return defaultName + i.toString() === value.name;
            });
            if (func) {
                i++;
            }
            else {
                return defaultName + i;
            }
        }
    };
    BindingManager.prototype.functionConfigToUI = function (config, bindings) {
        var _this = this;
        var configUI = {
            schema: "",
            version: "",
            bindings: [],
            originalConfig: config
        };
        if (config.bindings) {
            config.bindings.forEach(function (b) {
                var typeString = b.type;
                var type = BindingManager.getBindingType(typeString);
                var behaviorString = b.direction;
                var direction = binding_1.DirectionType[behaviorString];
                if (typeString) {
                    if ((binding_1.DirectionType[behaviorString] === binding_1.DirectionType.in) && (typeString.toLowerCase().indexOf("trigger") !== -1)) {
                        direction = binding_1.DirectionType.trigger;
                    }
                }
                var bindingConfig = bindings.find(function (cb) {
                    return (cb.direction === direction || (cb.direction === binding_1.DirectionType.in && direction === binding_1.DirectionType.trigger)) && cb.type === type;
                });
                var fb = {
                    id: _this.guid(),
                    name: b.name,
                    type: type,
                    direction: direction,
                    enabledInTryMode: false,
                    settings: [],
                    displayName: bindingConfig ? bindingConfig.displayName : ""
                };
                // Copy binding level settings
                for (var key in b) {
                    var findIndex = fb.settings.findIndex(function (setting) {
                        return setting.name === key;
                    });
                    if (findIndex === -1) {
                        fb.settings.push({
                            name: key,
                            value: b[key]
                        });
                    }
                }
                configUI.bindings.push(fb);
            });
        }
        return configUI;
    };
    BindingManager.prototype.UIToFunctionConfig = function (config) {
        var result = {
            bindings: []
        };
        //top-level
        for (var key in config.originalConfig) {
            if (key !== "bindings") {
                result[key] = config.originalConfig[key];
            }
        }
        if (config.bindings) {
            config.bindings.forEach(function (b) {
                var bindingToAdd = {};
                b.settings.forEach(function (s) {
                    if (!s.noSave) {
                        if (s.value === false) {
                            bindingToAdd[s.name] = false;
                        }
                        else if (!s.value) {
                            bindingToAdd[s.name] = "";
                        }
                        else {
                            bindingToAdd[s.name] = s.value;
                        }
                    }
                });
                bindingToAdd["direction"] = b.direction === binding_1.DirectionType.trigger ? binding_1.DirectionType.in.toString() : b.direction.toString();
                result.bindings.push(bindingToAdd);
            });
        }
        return result;
    };
    BindingManager.prototype.getBindingSchema = function (type, behavior, bindings) {
        return bindings.find(function (bindingSchema) {
            return bindingSchema.type === type && bindingSchema.direction === behavior;
        });
    };
    BindingManager.prototype.getDefaultBinding = function (type, direction, bindings, defaultStorageAccount) {
        var schema = this.getBindingSchema(type, direction, bindings);
        var parameterNameSetting = schema.settings.find(function (s) {
            return s.name === "name";
        });
        var result = {
            id: this.guid(),
            name: parameterNameSetting.defaultValue,
            type: type,
            direction: direction,
            enabledInTryMode: false,
            settings: [],
            displayName: schema.displayName
        };
        result.settings.push({
            value: type,
            name: "type"
        });
        schema.settings.forEach(function (s) {
            result.settings.push({
                value: s.name === "storageAccount" ? defaultStorageAccount : s.defaultValue,
                name: s.name
            });
        });
        return result;
    };
    BindingManager.prototype.getTemplates = function (behavior, bindings) {
        var bindings = bindings.filter(function (bindingSchema) {
            return bindingSchema.direction === behavior;
        });
        var result = [];
        bindings.forEach(function (b) {
            result.push({
                name: b.displayName,
                value: b.type.toString()
            });
        });
        return result;
    };
    BindingManager.prototype.setDefaultValues = function (bindings, defaultStorageAccount) {
        bindings.forEach(function (b) {
            for (var key in b) {
                if (key === "storageAccount") {
                    b[key] = defaultStorageAccount;
                }
            }
        });
    };
    BindingManager.prototype.validateConfig = function (config, translationService) {
        if (config.bindings) {
            config.bindings.forEach(function (b) {
                var duplicate = config.bindings.find(function (binding) {
                    return b !== binding && binding.name === b.name;
                });
                if (duplicate) {
                    throw translationService.instant(portal_resources_1.PortalResources.bindingsValidationNameDublicate, { functionName: b.name });
                }
                if (!b.name) {
                    throw translationService.instant(portal_resources_1.PortalResources.bindingsValidationNameMissed);
                }
                if (!b.direction) {
                    throw translationService.instant(portal_resources_1.PortalResources.bindingsValidationDirectionMissed);
                }
                if (!b.type) {
                    throw translationService.instant(portal_resources_1.PortalResources.bindingsValidationDirectionMissed);
                }
                if (!binding_1.DirectionType[b.direction.toLowerCase()]) {
                    throw translationService.instant(portal_resources_1.PortalResources.bindingsValidationDirectionUnknown, { direction: b.direction });
                }
                if (!binding_1.BindingType[b.type]) {
                    throw translationService.instant(portal_resources_1.PortalResources.bindingsValidationTypeUnknown, { type: b.type });
                }
            });
        }
    };
    //http://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
    BindingManager.prototype.guid = function () {
        return this.s4() + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' +
            this.s4() + '-' + this.s4() + this.s4() + this.s4();
    };
    BindingManager.prototype.s4 = function () {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    };
    BindingManager.getBindingType = function (value) {
        for (var type in binding_1.BindingType) {
            if (type.toString().toLowerCase() === value.toLowerCase()) {
                return binding_1.BindingType[type.toString()];
            }
        }
        return null;
    };
    return BindingManager;
}());
exports.BindingManager = BindingManager;
//# sourceMappingURL=binding-manager.js.map