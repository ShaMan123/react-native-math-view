'use strict';
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import AsyncStorage from '@react-native-community/async-storage';
import EventEmitter from 'events';
import * as _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import { AppState, findNodeHandle, NativeModules, Platform, requireNativeComponent, UIManager } from 'react-native';
var nativeViewName = 'RNMathJaxProvider';
var RNMathJaxProvider = requireNativeComponent(nativeViewName, Provider, {
    nativeOnly: {
        nativeID: true
    }
});
var ViewManager = NativeModules.RNMathViewManager || {};
export var Constants = (UIManager.getViewManagerConfig ? UIManager.getViewManagerConfig(nativeViewName) : UIManager[nativeViewName]).Constants;
var ViewModule = Platform.OS === 'ios' ? ViewManager : NativeModules.RNMathViewModule;
var CacheHandler = /** @class */ (function () {
    function CacheHandler(isGlobal) {
        if (isGlobal === void 0) { isGlobal = false; }
        var _this = this;
        this.active = false;
        this.disabled = false;
        this.warn = true;
        this.log = true;
        this.maxTimeout = 10000;
        this.storageKey = 'MathJaxProviderCache';
        this.viewTag = null;
        this.eventEmitter = new EventEmitter();
        this.isGlobal = false;
        this.pending = [];
        this.appState = AppState.currentState;
        this.eventEmitter.setMaxListeners(1000);
        _.map(CacheHandler.sharedConfig, function (val, key) { return _.set(_this, key, val); });
        this.getCache();
    }
    //  AsyncStorage
    CacheHandler.prototype.getAllKeys = function () {
        var _this = this;
        return AsyncStorage
            .getAllKeys()
            .then(function (keys) {
            return keys.filter(function (key) { return key.startsWith(_this.storageKey); });
        });
    };
    CacheHandler.prototype.fetchFromDatabase = function () {
        return this.getAllKeys()
            .then(function (cacheKeys) {
            return AsyncStorage
                .multiGet(cacheKeys)
                .then(function (response) {
                return response.map(function (value) {
                    var storageKey = value[0], data = value[1];
                    return JSON.parse(data);
                });
            });
        });
    };
    CacheHandler.prototype.setDatabaseItem = function (data) {
        var _this = this;
        return AsyncStorage
            .setItem(this.storageKey + ":" + data.math, JSON.stringify(data))
            .catch(function (err) {
            if (err.code === 13)
                _this.clearDatabase();
            console.error(err);
        });
    };
    CacheHandler.prototype.clearDatabase = function () {
        return this.getAllKeys()
            .then(function (cacheKeys) {
            return AsyncStorage
                .multiRemove(cacheKeys);
        });
    };
    //  CacheManager
    CacheHandler.prototype.getCache = function () {
        var _this = this;
        return Promise.resolve()
            .then(function () { return __awaiter(_this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!AsyncStorage) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.fetchFromDatabase()];
                    case 1:
                        response = _a.sent();
                        if (!response)
                            return [2 /*return*/];
                        CacheHandler.cache = response;
                        if (!this.active) {
                            this.active = true;
                            this.eventEmitter.emit('cache');
                        }
                        return [2 /*return*/, response];
                    case 2: return [2 /*return*/];
                }
            });
        }); })
            .catch(function (err) { return console.error(err); });
    };
    CacheHandler.prototype.addToCache = function (data) {
        if (this.disabled)
            console.error('MathJaxProvider.CacheManager is disabled');
        return this.updateCache(data);
    };
    CacheHandler.prototype.updateCache = function (data) {
        var _this = this;
        var _a;
        var response = _.filter(data, function (val) { return _.has(val, 'svg'); });
        (_a = CacheHandler.cache).push.apply(_a, response);
        _.pullAll(this.pending, _.map(response, 'math'));
        response.map(function (val) { return _this.eventEmitter.emit(val.math, val); });
        return Promise.resolve(AsyncStorage && !this.disabled ? _.map(response, function (val) { return _this.setDatabaseItem(val); }) : false);
    };
    CacheHandler.prototype.clearCache = function () {
        CacheHandler.cache = [];
        return Promise.resolve(AsyncStorage ? this.clearDatabase() : false);
    };
    CacheHandler.prototype.isCached = function (key) {
        return !_.isNil(_.find(CacheHandler.cache, function (val) { return val && _.isEqual(val.math, key); }));
    };
    CacheHandler.prototype.enable = function () {
        this.disabled = false;
        if (this.isGlobal)
            CacheHandler.sharedConfig.disabled = false;
        return this;
    };
    CacheHandler.prototype.disable = function () {
        this.disabled = true;
        if (this.isGlobal)
            CacheHandler.sharedConfig.disabled = true;
        return this;
    };
    //  RequestManager
    CacheHandler.prototype.disableWarnings = function () {
        this.warn = false;
        if (this.isGlobal)
            CacheHandler.sharedConfig.warn = false;
        return this;
    };
    CacheHandler.prototype.disableLogging = function () {
        this.disableWarnings();
        this.log = false;
        if (this.isGlobal)
            CacheHandler.sharedConfig.log = false;
        return this;
    };
    CacheHandler.prototype.setMaxTimeout = function (timeout) {
        this.maxTimeout = timeout;
        if (this.isGlobal)
            CacheHandler.sharedConfig.maxTimeout = timeout;
        return this;
    };
    CacheHandler.prototype.handleRequest = function (math) {
        return __awaiter(this, void 0, void 0, function () {
            var request, response, err_1;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        request = Array.isArray(math) ? math : [math];
                        return [4 /*yield*/, new Promise(function (resolve, reject) {
                                var callback = function () { return !_.isNil(_this.viewTag) && resolve(); };
                                callback();
                                _this.eventEmitter.once('provider', callback);
                                setTimeout(function () {
                                    _this.eventEmitter.removeListener('provider', callback);
                                    reject('timeout: Could not find MathJax.Provider');
                                }, _this.maxTimeout);
                            })];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, ViewModule.getMathJax(this.viewTag, request, { timeout: this.maxTimeout })];
                    case 3:
                        response = _a.sent();
                        this.updateCache(response);
                        //console.log('mip', _.map(request, (r, i) => ({ svg: TeXToSVG(r), ...response[i] })))
                        //this.updateCache(_.map(request, (r, i) => ({ svg: TeXToSVG(r), ...response[i] })));
                        return [2 /*return*/, response];
                    case 4:
                        err_1 = _a.sent();
                        if (this.warn) {
                            console.warn(err_1.message || err_1);
                        }
                        else if (this.log) {
                            console.log(err_1);
                        }
                        return [2 /*return*/, []];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    CacheHandler.prototype.fetch = function (math, timeout) {
        if (timeout === void 0) { timeout = this.maxTimeout; }
        return __awaiter(this, void 0, void 0, function () {
            var _a, isArr, arr, fetchFromNative, canResolve_1, response;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        isArr = Array.isArray(math);
                        arr = isArr ? math : [math];
                        fetchFromNative = _.reject(arr, function (m) { return _this.isCached(m) || !_.isNil(_.find(_this.pending, m)); });
                        (_a = this.pending).push.apply(_a, fetchFromNative);
                        if (!(_.size(fetchFromNative) > 0)) return [3 /*break*/, 2];
                        canResolve_1 = function () { return !_.every(fetchFromNative, _this.isCached); };
                        return [4 /*yield*/, Promise.race([
                                new Promise(function (resolve) {
                                    if (_this.active && canResolve_1)
                                        resolve();
                                    _this.eventEmitter.once('cache', function () { return canResolve_1() && resolve(); });
                                }),
                                this.handleRequest(fetchFromNative)
                            ])];
                    case 1:
                        _b.sent();
                        _b.label = 2;
                    case 2:
                        response = _.map(arr, function (val) { return _.find(CacheHandler.cache, function (o) { return o && _.isEqual(o.math, val); }); });
                        return [2 /*return*/, isArr ? response : response[0]];
                }
            });
        });
    };
    CacheHandler.prototype.onReady = function (math, callback) {
        var _this = this;
        var result = _.find(CacheHandler.cache, function (val) { return val.math === math; });
        if (result) {
            callback(result);
            return function () { };
        }
        else {
            this.eventEmitter.once(math, callback);
            this.fetch(math);
            return function () {
                try {
                    _this.eventEmitter.removeListener(math, callback);
                }
                catch (err) {
                    console.log(err);
                }
            };
        }
    };
    CacheHandler.prototype.setViewTag = function (next, prev) {
        _.pull(CacheHandler.tags, prev);
        if (_.isNumber(next))
            CacheHandler.tags.push(next);
        this.viewTag = next;
        if (CacheManager.viewTag === prev || _.isNil(CacheManager.viewTag))
            CacheManager.viewTag = CacheHandler.tags[0];
        this.eventEmitter.emit('provider', this.viewTag);
    };
    CacheHandler.prototype.isLinked = function () {
        return !_.isNil(this.viewTag);
    };
    CacheHandler.cache = [];
    CacheHandler.tags = [];
    CacheHandler.sharedConfig = {
        disabled: false,
        warn: true,
        log: true,
        maxTimeout: 10000
    };
    return CacheHandler;
}());
export var CacheManager = new CacheHandler(true);
export var Context = React.createContext(CacheHandler);
var Provider = /** @class */ (function (_super) {
    __extends(Provider, _super);
    function Provider(props) {
        var _this = _super.call(this, props) || this;
        _this.tag = null;
        _this._handleRef = function (ref) {
            var tag = ref ? findNodeHandle(ref) : null;
            _this.cacheManager.setViewTag(tag, _this.tag);
            _this.tag = tag;
        };
        _this.cacheManager = props.useGlobalCacheManager ? CacheManager : new CacheHandler();
        return _this;
    }
    Provider.getDerivedStateFormProps = function (nextProps) {
        this.cacheManager.fetch(nextProps.preload);
        return null;
    };
    Provider.prototype.componentDidMount = function () {
        var preload = this.props.preload;
        preload && this.cacheManager.fetch(preload);
    };
    Provider.prototype.preload = function (math) {
        return this.cacheManager.fetch(math);
    };
    Provider.prototype.clear = function () {
        return this.cacheManager.clearCache();
    };
    Provider.prototype.getCacheManager = function () {
        return this.cacheManager;
    };
    Object.defineProperty(Provider.prototype, "shouldRender", {
        get: function () {
            return !this.cacheManager.isLinked() || this.tag === CacheManager.viewTag || !this.props.useGlobalCacheManager;
        },
        enumerable: true,
        configurable: true
    });
    Provider.prototype.render = function () {
        return (React.createElement(React.Fragment, null,
            this.shouldRender &&
                React.createElement(RNMathJaxProvider, { ref: this._handleRef, onLayout: this.props.onLayout }),
            React.createElement(Context.Provider, { value: this.cacheManager }, this.props.children)));
    };
    Provider.propTypes = {
        onLayout: PropTypes.func,
        preload: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.string), PropTypes.string]),
        useGlobalCacheManager: PropTypes.bool
    };
    Provider.defaultProps = {
        useGlobalCacheManager: true
    };
    return Provider;
}(React.PureComponent));
export { Provider };
//# sourceMappingURL=MathProvider.js.map