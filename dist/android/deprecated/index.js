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
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
import * as _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import { Dimensions, NativeModules, requireNativeComponent, StyleSheet, UIManager, View, ViewPropTypes } from 'react-native';
import { CacheManager } from './MathProvider';
var nativeViewName = 'RNSVGMathView';
var RNMathView = requireNativeComponent(nativeViewName, SVGMathView, {
    nativeOnly: {
        nativeID: true
    }
});
var MathViewManager = NativeModules.RNMathViewManager || {};
export var Constants = (UIManager.getViewManagerConfig ? UIManager.getViewManagerConfig(nativeViewName) : UIManager[nativeViewName]).Constants;
var minDim = 35;
var padding = 10;
var styles = StyleSheet.create({
    base: {
        flex: 1,
        minHeight: minDim
    }
});
function getInnerStyle(math, layoutParams) {
    return __awaiter(this, void 0, void 0, function () {
        var layoutData;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, CacheManager.fetch(math)];
                case 1:
                    layoutData = _a.sent();
                    return [2 /*return*/, SVGMathView.getInnerStyle(layoutData, layoutParams)];
            }
        });
    });
}
function getInnerStyleSync(layoutData, _a) {
    var maxWidth = _a.maxWidth, maxHeight = _a.maxHeight, resizeMode = _a.resizeMode;
    var contain = resizeMode === 'contain';
    var cover = resizeMode === 'cover';
    var stretch = resizeMode === 'stretch';
    var pow = contain ? -1 : 1;
    var minMax = contain || stretch ? Math.min : Math.max;
    var aWidth = stretch ? maxWidth : _.get(layoutData, 'apprxWidth', 0);
    var aHeight = _.get(layoutData, 'apprxHeight', 0);
    aHeight = stretch ? _.defaultTo(maxHeight, aHeight) : aHeight;
    var window = Dimensions.get('window');
    var scaleWidth = Math.min(Math.pow(window.width / (maxWidth - padding * 2), pow), 1);
    var scaleHeight = Math.min(Math.min(minDim / aHeight), 1);
    var scale = cover ? 1 : minMax(scaleWidth, scaleHeight);
    var width = aWidth * scale;
    var height = aHeight * scale;
    return {
        minWidth: minDim,
        minHeight: Math.max(height, minDim),
        flexBasis: Math.max(width, minDim),
        maxWidth: cover ? width : maxWidth - padding * 2,
        display: 'flex',
        elevation: 5,
        flexDirection: 'row'
    };
}
function mip() {
}
var SVGMathView = /** @class */ (function (_super) {
    __extends(SVGMathView, _super);
    function SVGMathView(props) {
        var _this = _super.call(this, props) || this;
        _this.ref = React.createRef();
        _this.data = {};
        _this.update = function (data) {
            //this.data = _.set(data, 'svg', TeXToSVG(this.props.source.math));
            _this.data = data; //_.set(data, 'svg', TeXToSVG(this.props.source.math));
            _this.setNativeProps({ svg: data.svg, style: [_this.innerStyle, _this.props.style] });
        };
        _this._onLayout = function (e) {
            if (_this.props.scaleToFit)
                _this.setStyle(e.nativeEvent.layout.width, e.nativeEvent.layout.height);
        };
        var _a = Dimensions.get('window'), width = _a.width, height = _a.height;
        _this.maxWidth = width;
        _this.maxHeight = height;
        return _this;
        /*
        this.state = {
            maxWidth: width,
            maxHeight: height,
            //svg: props.source.svg
        };
        */
    }
    /*
     * @deprecated in favor of PureComponent
    static getDerivedStateFromProps(nextProps, prevState) {
        if (!nextProps.scaleToFit) {
            const { width, height } = Dimensions.get('window');
            if (width !== prevState.maxWidth) return { maxWidth: width, maxHeight: height };
        }
        return null;
    }
    */
    SVGMathView.prototype.componentDidMount = function () {
        this.subscribe();
    };
    SVGMathView.prototype.componentDidUpdate = function (prevProps, prevState) {
        if (!this.props.scaleToFit) {
            var _a = Dimensions.get('window'), width = _a.width, height = _a.height;
            this.setStyle(width, height);
        }
        if (!_.isEqual(prevProps.source, this.props.source)) {
            if (this.props.source.math) {
                this.subscribe();
            }
            else {
                this.update(_.set(data, 'svg', svg));
            }
        }
    };
    SVGMathView.prototype.componentWillUnmount = function () {
        this.unsubscribe();
    };
    SVGMathView.prototype.subscribe = function () {
        this.unsubscribe();
        var cacheManager = this.props.cacheManager;
        if (_.isNil(cacheManager.onReady)) {
            console.error("MathView: Did you forget to render <MathProvider /> ?");
        }
        else {
            this.disposer = cacheManager.onReady(this.props.source.math, this.update);
        }
    };
    SVGMathView.prototype.unsubscribe = function () {
        if (this.disposer)
            this.disposer();
    };
    Object.defineProperty(SVGMathView.prototype, "innerStyle", {
        get: function () {
            var _a = this, maxWidth = _a.maxWidth, maxHeight = _a.maxHeight;
            return SVGMathView.getInnerStyleSync(this.data, { maxWidth: maxWidth, maxHeight: maxHeight, resizeMode: this.props.resizeMode });
        },
        enumerable: true,
        configurable: true
    });
    SVGMathView.getInnerStyle = function (math, layoutParams) {
        return __awaiter(this, void 0, void 0, function () {
            var layoutData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, CacheManager.fetch(math)];
                    case 1:
                        layoutData = _a.sent();
                        return [2 /*return*/, SVGMathView.getInnerStyle(layoutData, layoutParams)];
                }
            });
        });
    };
    SVGMathView.getInnerStyleSync = function (layoutData, _a) {
        var maxWidth = _a.maxWidth, maxHeight = _a.maxHeight, resizeMode = _a.resizeMode;
        var contain = resizeMode === 'contain';
        var cover = resizeMode === 'cover';
        var stretch = resizeMode === 'stretch';
        var pow = contain ? -1 : 1;
        var minMax = contain || stretch ? Math.min : Math.max;
        var aWidth = stretch ? maxWidth : _.get(layoutData, 'apprxWidth', 0);
        var aHeight = _.get(layoutData, 'apprxHeight', 0);
        aHeight = stretch ? _.defaultTo(maxHeight, aHeight) : aHeight;
        var window = Dimensions.get('window');
        var scaleWidth = Math.min(Math.pow(window.width / (maxWidth - padding * 2), pow), 1);
        var scaleHeight = Math.min(Math.min(minDim / aHeight), 1);
        var scale = cover ? 1 : minMax(scaleWidth, scaleHeight);
        var width = aWidth * scale;
        var height = aHeight * scale;
        return {
            minWidth: minDim,
            minHeight: Math.max(height, minDim),
            flexBasis: Math.max(width, minDim),
            maxWidth: cover ? width : maxWidth - padding * 2,
            display: 'flex',
            elevation: 5,
            flexDirection: 'row'
        };
    };
    SVGMathView.prototype.setStyle = function (w, h) {
        this.maxWidth = w;
        this.maxHeight = h;
        this.setNativeProps({ style: [this.innerStyle, this.props.style] });
    };
    SVGMathView.prototype.setNativeProps = function (props) {
        this.ref.current && this.ref.current.setNativeProps(props);
    };
    SVGMathView.prototype.render = function () {
        return (React.createElement(React.Fragment, null,
            React.createElement(View, { style: StyleSheet.absoluteFill, onLayout: this._onLayout }),
            React.createElement(RNMathView, __assign({}, this.props, { style: [this.innerStyle, this.props.style], ref: this.ref }))));
    };
    SVGMathView.propTypes = {
        cacheManager: PropTypes.any,
        resizeMode: PropTypes.oneOf(['center', 'contain', 'cover', 'stretch']),
        scaleToFit: PropTypes.bool,
        source: PropTypes.shape({
            svg: PropTypes.string,
            math: PropTypes.string
        }).isRequired,
        style: ViewPropTypes.style
    };
    SVGMathView.defaultProps = {
        resizeMode: 'center',
        scaleToFit: false,
        style: styles.base
    };
    SVGMathView.Constants = Constants;
    SVGMathView.getPreserveAspectRatio = function (alignment, scale) { return alignment + " " + scale; };
    return SVGMathView;
}(React.PureComponent));
export default SVGMathView;
//# sourceMappingURL=index.js.map