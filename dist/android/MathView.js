'use strict';
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
import React, { useCallback, useMemo, useState, forwardRef } from 'react';
import { Dimensions, NativeModules, requireNativeComponent, StyleSheet, UIManager, View } from 'react-native';
import { TeXToSVG } from '../MathProvider';
var nativeViewName = 'RNSVGMathView';
var RNMathView = requireNativeComponent(nativeViewName);
/*
const RNMathView = requireNativeComponent(nativeViewName, MathView, {
    nativeOnly: {
        nativeID: true
    }
});
*/
var MathViewManager = NativeModules.RNMathViewManager || {};
export var Constants = (UIManager.getViewManagerConfig ? UIManager.getViewManagerConfig(nativeViewName) : UIManager[nativeViewName]).Constants;
var minDim = 35;
var padding = 10;
function getInnerStyle(math, layoutParams) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, getInnerStyleSync(TeXToSVG(math), layoutParams)];
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
function MathView(props, ref) {
    var _this = this;
    if (!props.math)
        return null;
    var _a = useState(function () {
        var _a = Dimensions.get('window'), width = _a.width, height = _a.height;
        return { width: width, height: height };
    }), layout = _a[0], setLayout = _a[1];
    //const ref = useRef();
    var setStyle = useCallback(function (w, h) {
        //this.maxWidth = w;
        //this.maxHeight = h;
        ref.current && ref.current.setNativeProps({ style: [_this.innerStyle, _this.props.style] });
    }, []);
    var onLayout = useCallback(function (e) {
        if (props.scaleToFit)
            setLayout({ width: e.nativeEvent.layout.width, height: e.nativeEvent.layout.height }); //this.setStyle(e.nativeEvent.layout.width, e.nativeEvent.layout.height);
    }, [props.scaleToFit, setLayout]);
    var data = useMemo(function () { return TeXToSVG(props.math); }, [props.math]);
    var innerStyle = useMemo(function () { return getInnerStyleSync(data, { maxWidth: layout.width, maxHeight: layout.height, resizeMode: props.resizeMode }); }, [data, layout, props.resizeMode]);
    return (React.createElement(React.Fragment, null,
        React.createElement(View, { style: StyleSheet.absoluteFill, onLayout: onLayout }),
        React.createElement(RNMathView, __assign({}, props, { svg: data.svg, style: [innerStyle, props.style], ref: ref }))));
}
var styles = StyleSheet.create({
    base: {
        flex: 1,
        minHeight: minDim
    }
});
var MathViewWrapper = forwardRef(MathView);
MathViewWrapper.defaultProps = MathView.defaultProps = {
    resizeMode: 'center',
    scaleToFit: false,
    style: styles.base
};
MathViewWrapper.Constants = Constants;
MathViewWrapper.getPreserveAspectRatio = function (alignment, scale) { return alignment + " " + scale; };
MathViewWrapper.getInnerStyle = getInnerStyle;
MathViewWrapper.getInnerStyleSync = getInnerStyleSync;
export default MathViewWrapper;
//# sourceMappingURL=MathView.js.map