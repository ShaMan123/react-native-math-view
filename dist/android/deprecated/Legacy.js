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
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { requireNativeComponent, NativeModules, StyleSheet } from 'react-native';
import memoize from 'lodash/memoize';
var RNMathView = requireNativeComponent('RNMathView', MathViewBase, {
    nativeOnly: {
        nativeID: true,
        onChange: true
    }
});
var MathViewManager = NativeModules.RNMathViewManager || {};
export var MATH_ENGINES = {
    KATEX: 'KATEX',
    MATHJAX: 'MATHJAX'
};
var MathViewBase = /** @class */ (function (_super) {
    __extends(MathViewBase, _super);
    function MathViewBase() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {
            size: MathViewBase.measure(_this.math)
        };
        _this.onChange = function (e) {
            var size = e.nativeEvent;
            MathViewBase.measure.cache.set(_this.props.math, size);
            _this.setState({ size: size });
        };
        _this.onLayout = function (e) {
            var onLayout = _this.props.onLayout;
            var size = _this.state.size;
            onLayout && size && onLayout(e);
        };
        return _this;
    }
    MathViewBase.pasreMath = function (math) {
        return "\\(" + math.replace(/\\\\/g, '\\') + "\\)";
    };
    Object.defineProperty(MathViewBase.prototype, "math", {
        get: function () {
            return MathViewBase.pasreMath(this.props.math);
        },
        enumerable: true,
        configurable: true
    });
    MathViewBase.prototype.render = function () {
        var size = this.state.size;
        return (React.createElement(RNMathView, __assign({}, this.props, { style: [this.props.style, styles.base, size], text: this.math, onChange: this.onChange, onLayout: this.onLayout })));
    };
    MathViewBase.propTypes = {
        math: PropTypes.string.isRequired,
        mathEngine: PropTypes.oneOf(Object.keys(MATH_ENGINES).map(function (key) { return MATH_ENGINES[key]; })),
        horizontalScroll: PropTypes.bool,
        verticalScroll: PropTypes.bool,
        scalesToFit: PropTypes.bool
    };
    MathViewBase.defaultProps = {
        mathEngine: MATH_ENGINES.KATEX,
        horizontalScroll: false,
        verticalScroll: false,
        scalesToFit: true
    };
    MathViewBase.measure = memoize(function (LaTex) { return undefined; });
    return MathViewBase;
}(Component));
export default MathViewBase;
var styles = StyleSheet.create({
    base: {
        alignItems: 'center', justifyContent: 'center', display: 'flex'
    }
});
//# sourceMappingURL=Legacy.js.map