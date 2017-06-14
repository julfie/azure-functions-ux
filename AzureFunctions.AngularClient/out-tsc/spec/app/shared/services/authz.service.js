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
var Observable_1 = require("rxjs/Observable");
require("rxjs/add/operator/map");
var arm_service_1 = require("./arm.service");
var cache_service_1 = require("./cache.service");
var AuthzService = AuthzService_1 = (function () {
    function AuthzService(_cacheService, _armService) {
        this._cacheService = _cacheService;
        this._armService = _armService;
        this._wildCardEscapeSequence = "\\*";
    }
    AuthzService.prototype.hasPermission = function (resourceId, requestedActions) {
        var _this = this;
        var authId = "" + resourceId + AuthzService_1.permissionsSuffix;
        return this._cacheService.getArm(authId, false, this._armService.armPermissionsVersion)
            .map(function (r) {
            var permissionsSet = r.json().value;
            return _this._checkPermissions(resourceId, requestedActions, permissionsSet);
        })
            .catch(function (e) {
            // We've seen cases where ARM has a bad day and permission checks will start to fail with 429's.
            // So if these requests fail, just assume that you have permission and try your best.
            if (e.status === 429 /* too many requests */) {
                return Observable_1.Observable.of(true);
            }
            return Observable_1.Observable.of(false);
        });
    };
    AuthzService.prototype.hasReadOnlyLock = function (resourceId) {
        return this._getLocks(resourceId)
            .map(function (locks) {
            return !!locks.find(function (l) { return l.properties.level === "ReadOnly"; });
        });
    };
    AuthzService.prototype._getLocks = function (resourceId) {
        var lockId = "" + resourceId + AuthzService_1.authSuffix;
        return this._cacheService.getArm(lockId, false, this._armService.armLocksApiVersion)
            .map(function (r) {
            return r.json().value;
        });
    };
    AuthzService.prototype._getResourceType = function (resourceId) {
        var parts = resourceId.split("/").filter(function (part) { return !!part; });
        var resourceType = parts[5];
        for (var i = 6; i < parts.length; i += 2) {
            resourceType = resourceType + "/" + parts[i];
        }
        return resourceType;
    };
    AuthzService.prototype._checkPermissions = function (resourceId, requestedActions, permissionsSet) {
        var _this = this;
        if (!requestedActions || !permissionsSet || permissionsSet.length === 0) {
            // If there are no requested actions or no available actions the caller has no permissions
            return false;
        }
        var resourceType = this._getResourceType(resourceId);
        var permissionSetRegexes = permissionsSet.map(function (permission) {
            return _this._permissionsToRegExp(permission);
        });
        return requestedActions.every(function (action) {
            if (action.length > 1 && action.charAt(0) === "." && action.charAt(1) === "/") {
                // Special case: turn leading ./ to {resourceType}/ for formatting.
                action = resourceType + action.substring(1);
            }
            return !!permissionSetRegexes.find(function (availableRegex) {
                return _this._isAllowed(action, availableRegex);
            });
        });
    };
    AuthzService.prototype._permissionsToRegExp = function (permissions) {
        var _this = this;
        var actions = permissions.actions.map(function (pattern) {
            return _this._convertWildCardPatternToRegex(pattern);
        });
        var notActions = permissions.notActions.map(function (pattern) {
            return _this._convertWildCardPatternToRegex(pattern);
        });
        return {
            actions: actions,
            notActions: notActions
        };
    };
    /*
    * 1. All allowed character escapes are taken into account: \*, \t, \n, \r, \\, \'
    *    a. \0 is explicitly not supported
    * 2. All non-escaped wildcards match 0 or more characters of anything
    * 3. The entire wildcard pattern is matched from beginning to end, and no more (e.g., a*d matches add but not adding or bad).
    * 4. The pattern matching should be case insensitive.
    */
    AuthzService.prototype._convertWildCardPatternToRegex = function (wildCardPattern) {
        wildCardPattern = wildCardPattern.replace(this._wildCardEscapeSequence, "\0"); // sentinel for escaped wildcards
        var regex = this._escapeRegExp(wildCardPattern) // escape the rest of the regex
            .replace(this._wildCardEscapeSequence, ".*") // the previous command escaped legitimate wildcards - replace them with Regex wildcards
            .replace("\0", this._wildCardEscapeSequence) // replace sentinels with truly escaped wildcards
            .replace("\\t", "\t") // tabs
            .replace("\\n", "\n") // newlines
            .replace("\\r", "\r") // carriage returns
            .replace("\\\\", "\\") // backslashes
            .replace("\\'", "'"); // single quotes
        return new RegExp("^" + regex + "$", "i"); // perform case insensitive compares
    };
    // Escape reserved regex characters so that they are not interpreted by regex evaluation.
    AuthzService.prototype._escapeRegExp = function (regex) {
        return regex.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
    };
    AuthzService.prototype._isAllowed = function (requestedAction, permission) {
        var actionAllowed = !!permission.actions.find(function (action) { return action.test(requestedAction); });
        var actionDenied = !!permission.notActions.find(function (notAction) { return notAction.test(requestedAction); });
        return actionAllowed && !actionDenied;
    };
    return AuthzService;
}());
AuthzService.readScope = "./read";
AuthzService.writeScope = "./write";
AuthzService.deleteScope = "./delete";
AuthzService.actionScope = "./action";
AuthzService.permissionsSuffix = "/providers/microsoft.authorization/permissions";
AuthzService.authSuffix = "/providers/Microsoft.Authorization/locks";
AuthzService = AuthzService_1 = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [cache_service_1.CacheService, arm_service_1.ArmService])
], AuthzService);
exports.AuthzService = AuthzService;
var AuthzService_1;
//# sourceMappingURL=authz.service.js.map