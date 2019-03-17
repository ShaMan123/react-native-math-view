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

class MathViewBase extends Component {
    static propTypes = {
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

    constructor(props) {
        super(props);
        this._onChange = this._onChange.bind(this);
        const math = MathViewBase.pasreMath(props.text);
        this.state = {
            width: null,
            height: null,
            ...MathViewBase.measure(math),
            math
        };

        this.updated = false;
        
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.text !== prevState.math) {
            const math = MathViewBase.pasreMath(nextProps.text);
            const measured = MathViewBase.measure(math);
            return {
                width: null,
                height: null,
                math,
                ...measured
            };
        }

        return null;
    }


    componentDidUpdate(prevProps, prevState) {
        if ((prevState.width !== this.state.width || prevState.math !== this.state.math || !this.updated) && this.computedStyle && this.props.onSizeChanged) {
            this.updated = true;
            
            this.props.onSizeChanged(this.computedStyle);
        }
    }

    _onChange(e) {
        if (e.nativeEvent.hasOwnProperty('onSizeChanged')) {
            const sizeObj = e.nativeEvent.size;
            const width = Math.round(sizeObj.width);
            const height = Math.round(sizeObj.height);

            if (!this.computedStyle) {
                MathViewBase.measure.cache.set(this.state.math, { width, height });
                this.setState({
                    width,
                    height
                });
            }
            
        }
        else if (e.nativeEvent.hasOwnProperty('touchEvent')) {
            this.props.onPress(e.nativeEvent.touchEvent);
        }
    }

    get computedStyle() {
        const { width, height } = this.state;

        return width &&  height ? {
            width,
            height
        } : null;
    }

    render() {
        const { forwardedRef, ...props } = this.props;
        
        return (
            <RNMathView
                {...props}
                style={this.computedStyle}
                ref={forwardedRef}
                onChange={this._onChange}
                text={this.state.math}
            />
        );
    }
}

export default React.forwardRef((props, ref) => <MathViewBase {...props} forwardedRef={ref} />);

