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
import * as React from 'react';
import { UIManager, requireNativeComponent, NativeModules } from 'react-native';
var nativeViewName = 'RNMathView';
var RNMathView = requireNativeComponent(nativeViewName);
var MathViewManager = NativeModules.RNMathViewManager || {};
export var Constants = (UIManager.getViewManagerConfig ? UIManager.getViewManagerConfig(nativeViewName) : UIManager[nativeViewName]).Constants;
export default function MathView(props) {
    return (React.createElement(RNMathView, __assign({}, this.props, { math: this.props.source.math })));
}
//# sourceMappingURL=MathView.js.map