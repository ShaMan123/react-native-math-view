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
import React from 'react';
import SVGMathView from './SVGMathView';
import { Context } from './MathProvider';
var MathView = /** @class */ (function (_super) {
    __extends(MathView, _super);
    function MathView() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MathView.prototype.render = function () {
        var _this = this;
        return (React.createElement(Context.Consumer, null, function (cacheManager) {
            return (React.createElement(SVGMathView, __assign({}, _this.props, { ref: _this.props.forwardedRef, cacheManager: cacheManager })));
        }));
    };
    MathView.propTypes = SVGMathView.propTypes;
    MathView.getPreserveAspectRatio = SVGMathView.getPreserveAspectRatio;
    MathView.getInnerStyleSync = SVGMathView.getInnerStyleSync;
    MathView.getInnerStyle = SVGMathView.getInnerStyle;
    return MathView;
}(React.PureComponent));
var Exporter = React.forwardRef(function (props, forwardedRef) { return React.createElement(MathView, __assign({}, props, { forwardedRef: forwardedRef })); });
Exporter.propTypes = SVGMathView.propTypes;
Exporter.getPreserveAspectRatio = SVGMathView.getPreserveAspectRatio;
Exporter.getInnerStyleSync = SVGMathView.getInnerStyleSync;
Exporter.getInnerStyle = SVGMathView.getInnerStyle;
export default Exporter;
//# sourceMappingURL=MathView.js.map