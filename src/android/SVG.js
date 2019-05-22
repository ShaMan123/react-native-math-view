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


const RNMathView = requireNativeComponent('RNSVGMathView', SVGMathView, {
    nativeOnly: {
        nativeID: true
    }
});

const MathViewManager = NativeModules.RNMathViewManager || {};

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

    render() {
        return (
            <RNMathView
                {...this.props}
            />
        );
    }
}



