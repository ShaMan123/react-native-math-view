'use strict';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactNative, {
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
import memoize from 'lodash/memoize';


const RNMathView = requireNativeComponent('RNSVGMathView', MathViewBase, {
    nativeOnly: {
        nativeID: true,
        onChange: true
    }
});

const MathViewManager = NativeModules.RNMathViewManager || {};

export const MATH_ENGINES = {
    KATEX: 'KATEX',
    MATHJAX: 'MATHJAX'
};

export default class MathViewBase extends Component {

    render() {
        return (
            <RNMathView
                //style={{height:1,width:1}}
                style={{flex:1,minWidth:35,minHeight: 35,backgroundColor:'red'}}
                onLayout={(e) => console.log('laying out canvas', e.nativeEvent)}
                pointerEvents="none"
            />
        );
    }
}

const styles = StyleSheet.create({
    base: {
        alignItems: 'center', justifyContent: 'center', display: 'flex'
    }
});

