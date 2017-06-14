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
require("rxjs/add/operator/catch");
require("rxjs/add/operator/map");
require("rxjs/add/operator/share");
require("rxjs/add/observable/of");
require("rxjs/add/observable/throw");
var arm_service_1 = require("./arm.service");
var cache_decorator_1 = require("../decorators/cache.decorator");
var Cache = (function () {
    function Cache() {
    }
    return Cache;
}());
exports.Cache = Cache;
var CacheService = (function () {
    function CacheService(_armService) {
        this._armService = _armService;
        this._expireMS = 60000;
        this._cleanUpMS = 3 * this._expireMS;
        this.cleanUpEnabled = true;
        this._cache = new Cache();
        setTimeout(this._cleanUp.bind(this), this._cleanUpMS);
    }
    CacheService.prototype.getArm = function (resourceId, force, apiVersion, invokeApi) {
        var url = this._getArmUrl(resourceId, apiVersion);
        return this._send(url, "GET", force, null, null, invokeApi);
    };
    CacheService.prototype.postArm = function (resourceId, force, apiVersion) {
        var url = this._getArmUrl(resourceId, apiVersion);
        return this._send(url, "POST", force);
    };
    CacheService.prototype.putArm = function (resourceId, apiVersion, content) {
        var _this = this;
        var url = this._getArmUrl(resourceId, apiVersion);
        return this._send(url, "PUT", true, null, content)
            .map(function (result) {
            // Clear the cache after a PUT request.
            delete _this._cache[url.toLowerCase()];
            return result;
        });
    };
    CacheService.prototype.get = function (url, force, headers, invokeApi) {
        return this._send(url, "GET", force, headers, null, invokeApi);
    };
    CacheService.prototype.post = function (url, force, headers, content) {
        return this._send(url, "POST", force, headers, content);
    };
    CacheService.prototype.put = function (url, force, headers, content) {
        return this._send(url, "PUT", force, headers, content);
    };
    CacheService.prototype.clearCache = function () {
        this._cache = new Cache();
    };
    CacheService.prototype.clearArmIdCachePrefix = function (armIdPrefix) {
        var prefix = "" + this._armService.armUrl + armIdPrefix;
        this.clearCachePrefix(prefix);
    };
    CacheService.prototype.clearCachePrefix = function (prefix) {
        prefix = prefix.toLowerCase();
        for (var key in this._cache) {
            if (key.startsWith(prefix) && this._cache.hasOwnProperty(key)) {
                delete this._cache[key];
            }
        }
    };
    // searchArm(term : string, subs: Subscription[], nextLink : string){
    //     let url : string;
    //     if(nextLink){
    //         url = nextLink;
    //     }
    //     else{
    //         url = `${this._armService.armUrl}/resources?api-version=${this._armService.armApiVersion}&$filter=(`;
    //         for(let i = 0; i < subs.length; i++){
    //             url += `subscriptionId eq '${subs[i].subscriptionId}'`;
    //             if(i < subs.length - 1){
    //                 url += ` or `;
    //             }
    //         }
    //         url += `) and (substringof('${term}', name)) and (resourceType eq 'microsoft.web/sites')`;
    //     }
    //     return this.get(url).map<ArmArrayResult>(r => r.json());
    // }
    CacheService.prototype._cleanUp = function () {
        if (!this.cleanUpEnabled) {
            return;
        }
        for (var key in this._cache) {
            if (this._cache.hasOwnProperty(key)) {
                var item = this._cache[key];
                if (Date.now() >= item.expireTime) {
                    delete this._cache[key];
                }
            }
        }
        setTimeout(this._cleanUp.bind(this), this._cleanUpMS);
    };
    CacheService.prototype._send = function (url, method, force, headers, content, invokeApi) {
        var _this = this;
        var key = url.toLowerCase();
        // Grab a reference before any async calls in case the item gets cleaned up
        var item = this._cache[key];
        if (item && item.responseObservable) {
            // There's currently a request in flight.  I think it makes sense for
            // "force" not to matter here because 1, you're already updating the
            // data, and 2, you may have 2 requests in flight which could end
            // up in a race
            return item.responseObservable;
        }
        else if (!force && item && Date.now() < item.expireTime) {
            return Observable_1.Observable.of(item.isRawResponse ? item.value : this._clone(item.value));
        }
        else {
            var etag = item && item.etag;
            if (etag && headers) {
                headers.append('If-None-Match', etag);
            }
            var responseObs = this._armService.send(method, url, content, etag, headers, invokeApi)
                .map(function (response) {
                return _this._mapAndCacheResponse(response, key);
            })
                .share()
                .catch(function (error) {
                if (error.status === 304) {
                    _this._cache[key] = _this.createCacheItem(key, item.value, // We're assuming that if we have a 304, that item will not be null
                    error.headers.get("ETag"), null, item.isRawResponse);
                    return Observable_1.Observable.of(item.isRawResponse ? item.value : _this._clone(item.value));
                }
                else {
                    return Observable_1.Observable.throw(error);
                }
            });
            this._cache[key] = this.createCacheItem(key, item && item.value, etag, responseObs, false);
            return responseObs;
        }
    };
    CacheService.prototype._mapAndCacheResponse = function (response, key) {
        var responseETag = response.headers.get("ETag");
        this._cache[key] = this.createCacheItem(key, response, responseETag, null, true);
        return response;
    };
    CacheService.prototype._clone = function (obj) {
        return JSON.parse(JSON.stringify(obj));
    };
    CacheService.prototype.createCacheItem = function (id, value, etag, responseObs, isRawResponse) {
        return {
            id: id,
            value: value,
            expireTime: Date.now() + this._expireMS,
            etag: etag,
            responseObservable: responseObs,
            isRawResponse: isRawResponse
        };
    };
    CacheService.prototype._getArmUrl = function (resourceId, apiVersion) {
        var url = "" + this._armService.armUrl + resourceId;
        return this._updateQueryString(url, "api-version", apiVersion ? apiVersion : this._armService.websiteApiVersion);
    };
    // private _getArmUrlWithQueryString(resourceId : string, queryString : string){
    //     if(queryString.startsWith("?")){
    //         return `${this._armService.armUrl}${resourceId}${queryString}`;
    //     }
    //     else{
    //         return `${this._armService.armUrl}${resourceId}?${queryString}`;
    //     }
    // }
    // http://stackoverflow.com/questions/5999118/add-or-update-query-string-parameter
    CacheService.prototype._updateQueryString = function (uri, key, value) {
        var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
        var separator = uri.indexOf('?') !== -1 ? "&" : "?";
        if (uri.match(re)) {
            return uri.replace(re, '$1' + key + "=" + value + '$2');
        }
        else {
            return uri + separator + key + "=" + value;
        }
    };
    return CacheService;
}());
__decorate([
    cache_decorator_1.ClearCache('clearAllCachedData'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CacheService.prototype, "clearCache", null);
CacheService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [arm_service_1.ArmService])
], CacheService);
exports.CacheService = CacheService;
//# sourceMappingURL=cache.service.js.map