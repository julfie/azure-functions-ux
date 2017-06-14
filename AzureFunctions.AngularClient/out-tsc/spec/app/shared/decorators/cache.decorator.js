"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Observable_1 = require("rxjs/Observable");
require("rxjs/add/operator/do");
require("rxjs/add/operator/map");
require("rxjs/add/operator/share");
require("rxjs/add/observable/of");
var cachedData = {};
/**
 * Caches the returned Observable.
 * The cache key used is either a property with the name ${propertyKey} from the first arg to the function.
 * If propertyKey isn't specified or not there, then if the first arg is string, it's used as the key
 * else we stringify the whole object.
 *
 * If there are no args passed to the function, then the function name is the key.
 */
function Cache(propertyKey, arg) {
    return function (target, functionName, descriptor) {
        var originalMethod = descriptor.value;
        descriptor.value = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var key = getCacheKey(functionName, propertyKey, args, arg || 0);
            var cache = cachedData[key];
            // Special case getTemplates() for testing templates
            try {
                if (window.localStorage &&
                    ((functionName === 'getTemplates' && window.localStorage.getItem('dev-templates')) ||
                        (functionName === 'getBindingConfig' && window.localStorage.getItem('dev-bindings')))) {
                    return originalMethod.apply(this, args);
                }
            }
            catch (e) {
                console.log(e);
            }
            if (cache && cache.data) {
                return Observable_1.Observable.of(cache.data);
            }
            else if (cache && cache.observable) {
                return cache.observable;
            }
            else {
                cache = {
                    observable: originalMethod.apply(this, args)
                        .map(function (r) {
                        delete cache.observable;
                        cache.data = r;
                        return cache.data;
                    })
                        .do(null, function (error) {
                        delete cachedData[key];
                    })
                        .share()
                };
                cachedData[key] = cache;
                return cache.observable;
            }
        };
        return descriptor;
    };
}
exports.Cache = Cache;
/**
 * This function clears the cache by @Cache based on the same key and functionName logic.
 * This function requires the name of the function that would have generated the cache that needs to be cleared.
 * Also if the function called is 'clearAllCachedData()' then all data is cleared.
 */
function ClearCache(functionName, propertyKey, arg) {
    return function (target, propertyName, descriptor) {
        var originalMethod = descriptor.value;
        descriptor.value = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            if (functionName === 'clearAllCachedData') {
                cachedData = {};
            }
            else if (functionName === 'clearAllFunction' && propertyKey) {
                for (var key in cachedData) {
                    if (key.startsWith(propertyKey + '+')) {
                        delete cachedData[key];
                    }
                }
            }
            else {
                var key = getCacheKey(functionName, propertyKey, args, arg || 0);
                delete cachedData[key];
            }
            return originalMethod.apply(this, args);
        };
        return descriptor;
    };
}
exports.ClearCache = ClearCache;
function ClearAllFunctionCache(functionInfo) {
    for (var e in cachedData) {
        var normalizedKey = e.toLocaleLowerCase();
        var normalizedFunctionName = functionInfo.name.toLocaleLowerCase();
        if (normalizedKey.indexOf("/" + normalizedFunctionName + "/") !== -1 ||
            normalizedKey.endsWith(normalizedFunctionName) ||
            normalizedKey.indexOf("/" + normalizedFunctionName + ".") !== -1) {
            delete cachedData[e];
        }
    }
}
exports.ClearAllFunctionCache = ClearAllFunctionCache;
function getCacheKey(functionName, propertyName, args, arg) {
    var key = functionName + "+";
    if (propertyName && args && args.length >= arg && args[arg][propertyName]) {
        key += args[arg][propertyName];
    }
    else if (args && args.length >= arg && typeof args[arg] === 'string') {
        key += args[arg];
    }
    else if (args && args.length > 1) {
        key += JSON.stringify(args);
    }
    return key;
}
//# sourceMappingURL=cache.decorator.js.map