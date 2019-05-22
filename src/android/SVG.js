'use strict';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    requireNativeComponent,
    NativeModules,
    UIManager,
    PixelRatio,
    Platform,
    ViewPropTypes,
    processColor,
    Dimensions,
    Animated,
    View,
    StyleSheet,
    findNodeHandle
} from 'react-native';

const nativeViewName = 'RNSVGMathView';
const RNMathView = requireNativeComponent(nativeViewName, SVGMathView, {
    nativeOnly: {
        nativeID: true
    }
});
const MathViewManager = NativeModules.RNMathViewManager || {};
export const { Constants } = UIManager.getViewManagerConfig ? UIManager.getViewManagerConfig(nativeViewName) : UIManager[nativeViewName];

const styles = StyleSheet.create({
    base: {
        flex: 1,
        minHeight: 35
    }
});

export default class SVGMathView extends Component {
    static propTypes = {
        style: ViewPropTypes.style,
        svg: PropTypes.string.isRequired
    }
    static defaultProps = {
        style: styles.base
    }

    static Constants = Constants;

    ref = React.createRef();

    setNativeProps(props) {
        this.ref.current && this.ref.current.setNativeProps(props);
    }

    render() {
        return (
            <RNMathView
                {...this.props}
                ref={this.ref}
            />
        );
    }
}



