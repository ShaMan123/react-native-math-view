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


const RNMathView = requireNativeComponent('RNMathView', MathViewBase, {
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
    static propTypes = {
        math: PropTypes.string.isRequired,
        mathEngine: PropTypes.oneOf(Object.keys(MATH_ENGINES).map((key) => MATH_ENGINES[key])),
        horizontalScroll: PropTypes.bool,
        verticalScroll: PropTypes.bool,
        scalesToFit: PropTypes.bool

    }
    static defaultProps = {
        mathEngine: MATH_ENGINES.KATEX,
        horizontalScroll: false,
        verticalScroll: false,
        scalesToFit: true
    }

    static measure = memoize((LaTex) => undefined);

    static pasreMath(math) {
        return `\\(${math.replace(/\\\\/g, '\\')}\\)`;
    }

    state = {
        size: MathViewBase.measure(this.math)
    }

    get math() {
        return MathViewBase.pasreMath(this.props.math);
    }

    onChange = (e) => {
        const size = e.nativeEvent;
        MathViewBase.measure.cache.set(this.props.math, size);
        this.setState({ size });
    }

    render() {
        const { size } = this.state;
        return (
            <View>
                <RNMathView
                    {...this.props}
                    style={[this.props.style, styles.base, size]}
                    text={this.math}
                    onChange={this.onChange}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    base: {
        alignItems: 'center', justifyContent: 'center', display: 'flex'
    }
});

