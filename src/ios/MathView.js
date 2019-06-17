'use strict';
import React from 'react';

const nativeViewName = 'RNMathView';
const RNMathView = requireNativeComponent(nativeViewName, SVGMathView, {
    nativeOnly: {
        nativeID: true
    }
});
const MathViewManager = NativeModules.RNMathViewManager || {};
export const { Constants } = UIManager.getViewManagerConfig ? UIManager.getViewManagerConfig(nativeViewName) : UIManager[nativeViewName];

export default class MathView extends React.PureComponent {
    static propTypes = {
        source: PropTypes.shape({
            math: PropTypes.string
        }).isRequired,
        style: ViewPropTypes.style
    }

    render() {
        return (
            <RNMathView
                {...this.props}
                math={this.props.source.math}
            />
        );
    }
}