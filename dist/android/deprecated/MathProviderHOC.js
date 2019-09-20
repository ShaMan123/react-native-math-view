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
import { Provider } from './MathProvider';
import * as _ from 'lodash';
var providerProps = ['preload', 'useGlobalCacheManager'];
export default function MathProviderHOC(WrappedComponent, props) {
    if (props === void 0) { props = {}; }
    return /** @class */ (function (_super) {
        __extends(MathProviderHOC, _super);
        function MathProviderHOC() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        MathProviderHOC.prototype.render = function () {
            return (React.createElement(Provider, __assign({}, this.props),
                React.createElement(WrappedComponent, __assign({}, _.omit.apply(_, [_.assign({}, this.props, props)].concat(providerProps))))));
        };
        return MathProviderHOC;
    }(React.PureComponent));
}
//# sourceMappingURL=MathProviderHOC.js.map