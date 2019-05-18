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
        verticalScroll: PropTypes.bool

    }
    static defaultProps = {
        mathEngine: MATH_ENGINES.KATEX,
        horizontalScroll: false,
        verticalScroll: false
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
        console.log(size)
        this.setState({ size });
    }

    render() {
        const { size } = this.state;
        return (
            <RNMathView
                {...this.props}
                style={[/*StyleSheet.absoluteFill,*/{ backgroundColor: 'pink' }, size]}
                text={this.math}
                onLayout={(e) => console.log(e.nativeEvent)}
                onChange={this.onChange}
            />
        );
    }
}

//export default React.forwardRef((props, ref) => <MathViewBase {...props} forwardedRef={ref} />);

