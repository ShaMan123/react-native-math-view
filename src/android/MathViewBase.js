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
        mathEngine: PropTypes.oneOf(Object.keys(MATH_ENGINES).map((key) => { return MATH_ENGINES[key] })),
        horizontalScroll: PropTypes.bool,
        verticalScroll: PropTypes.bool

    }
    static defaultProps = {
        mathEngine: MATH_ENGINES.KATEX,
        horizontalScroll: false,
        verticalScroll: false
    }

    static measure = memoize((LaTex) => undefined);

    constructor(props) {
        super(props);
        this._onChange = this._onChange.bind(this);
        this.state = {
            width: null,
            height: null,
            ...MathViewBase.measure(props.text),
            scale: 1
        };
        
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        let scale = 1;
        
        if (nextProps.containerLayout && prevState.width && prevState.height) {
            const computedScale = (nextProps.containerLayout.width - 20) / prevState.width;
            scale = computedScale > 0 && computedScale < 1 ? computedScale : 1;
            if (prevState.scale !== scale) return { scale };
        }
        
        return null;
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.width !== this.state.width && this.props.onSizeChanged) this.props.onSizeChanged(this.computedStyle);
    }

    get mathString() {
        return Platform.select({
            android: `\\(${this.props.text.replace(/\\\\/g, '\\')}\\)`,
            ios: `\\(${this.props.text.replace(/\\\\/g, '\\')}\\)`
        });
    }

    _onChange(e) {
        if (e.nativeEvent.hasOwnProperty('onSizeChanged')) {
            const sizeObj = e.nativeEvent.size;
            const width = Math.round(sizeObj.width);
            const height = Math.round(sizeObj.height);
            const computedScale = this.props.containerLayout ? (this.props.containerLayout.width - 20) / width : 1;
            const scale = computedScale > 0 && computedScale < 1 ? computedScale : 1;
            
            if (!(this.state.width && this.state.height)) {
                MathViewBase.measure.cache.set(this.props.text, { width, height });
                this.setState({
                    width,
                    height,
                    scale
                });
            }
            
        }
        else if (e.nativeEvent.hasOwnProperty('touchEvent')) {
            this.props.onPress(e.nativeEvent.touchEvent);
        }
    }

    get computedStyle() {
        const { width, height, scale } = this.state;

        return width &&  height && scale ? {
            width: width * scale,
            height: height * scale,
            //maxWidth: width,
            //maxHeight: height
        } : null;
    }

    render() {
        const { forwardedRef, ...props } = this.props;
        console.log(this.state)
        return (
            <RNMathView
                {...props}
                style={this.computedStyle}
                ref={forwardedRef}
                onChange={this._onChange}
                text={this.mathString}
                fontShrink={this.state.scale}
            />
        );
    }
}

export default React.forwardRef((props, ref) => <MathViewBase {...props} forwardedRef={ref} />);

