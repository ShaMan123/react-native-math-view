'use strict';

import React from 'react';
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
    WebView
} from 'react-native';

import memoize from 'lodash/memoize';

const RNMathTextView = requireNativeComponent('RNMathView', MathView, {
    nativeOnly: {
        nativeID: true,
        onChange: true
    }
});

const MathTextViewManager = NativeModules.RNMathViewManager || {};

const MATH_ENGINES = {
    KATEX: 'KATEX',
    MATHJAX: 'MATHJAX'
};

const styles = StyleSheet.create({
    wrapper: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
    },
    tag: {
        marginHorizontal: 10
    }
});


export default class MathView extends React.Component {
    static MATH_ENGINES = MATH_ENGINES;
    static propTypes = {
        style: ViewPropTypes.style,
        text: PropTypes.string.isRequired,
        mathEngine: PropTypes.oneOf(Object.keys(MATH_ENGINES).map((key) => { return MATH_ENGINES[key] })),
        onFullMount: PropTypes.func,
        initialOpacity: function (props, propName, componentName) {
            const propValue = props[propName];
            if (typeof propValue !== 'number' || propValue < 0 || propValue > 1) {
                return new Error(
                    'Invalid prop `' + propName + '` supplied to' +
                    ' `' + componentName + '`. Supply a valid opacity value.'
                );
            }
        },
        initialScale: PropTypes.number
    };

    static defaultProps = {
        style: null,
        text: '',
        mathEngine: MATH_ENGINES.KATEX,
        onFullMount: () => { },
        initialOpacity: 0.2,
        initialScale: 0
    };

    static memoize = memoize((LaTex) => undefined);

    static getStyleObject = memoize((style) => {
        return style && StyleSheet.flatten(style);
    })

    constructor(props) {
        super(props);

        this.state = {
            width: null,
            height: null,
            scale: props.initialScale,
            ...MathView.memoize(this.props.text),
            layout: null
        };

        this.opacity = new Animated.Value(props.initialOpacity);
        this.scale = new Animated.Value(this.state.scale);
        this.updated = false;
        this.style = {
            opacity: this.opacity,
            transform: [{ scale: this.scale }, { perspective: 1000 }]
        };

        this._onChange = this._onChange.bind(this);
    }

    componentDidUpdate() {
        const { width, height, layout } = this.state;
        if (typeof width === 'number' && typeof height === 'number' && !this.updated) {
            this.updated = true;
        }
        if (layout && layout.width > 0 && layout.height > 0) {
            const scale = this.maxWidth / layout.width;
            MathView.memoize.cache.set(this.props.text, { width, height, scale });
            const animations = [
                Animated.spring(this.opacity, {
                    toValue: 1,
                    useNativeDriver: true
                }),
                Animated.spring(this.scale, {
                    toValue: scale < 1 ? scale : 1,
                    useNativeDriver: true
                })
            ];

            Animated.parallel(animations).start(() => {
                this.props.onFullMount({ ...layout, scale });
            });
        }
    }

    get mathString() {
        return Platform.select({
            android: `\\(${this.props.text.replace(/\\\\/g, '\\')}\\)`,
            ios: `\\(${this.props.text.replace(/\\\\/g, '\\')}\\)`
        });
    }

    getProp(propName) {
        return MathView.getStyleObject(this.props.style)[propName];
    }

    get maxWidth() {
        const style = MathView.getStyleObject(this.props.style);
        const dimensions = Dimensions.get('window');
        return (style.width || style.maxWidth || dimensions.width) - 20;
    }

    _onChange(e) {
        if (e.nativeEvent.hasOwnProperty('onSizeChanged')) {
            const sizeObj = e.nativeEvent.size;
            const width = parseInt(sizeObj.width);
            const height = parseInt(sizeObj.height);

            this.setState({
                width,
                height
            });
        }
        else if (e.nativeEvent.hasOwnProperty('touchEvent')) {
            this.props.onPress(e.nativeEvent.touchEvent);
        }
    }

    render() {
        const { style, mathEngine } = this.props;
        const { width, height } = this.state;
        const computedStyle = typeof width === 'number' && typeof height === 'number' ? { width, height } : {};

        return (
            <Animated.View
                style={[styles.wrapper, /*style,*/ this.style]}
                onLayout={(e) => this.setState({ layout: e.nativeEvent.layout })}
            >
                <RNMathTextView
                    ref={ref => this._handle = ReactNative.findNodeHandle(ref)}
                    {...this.props}
                    style={[styles.tag, computedStyle]}
                    onChange={this._onChange}
                    mathEngine={mathEngine}
                    text={this.mathString}
                />
            </Animated.View>
        );
    }
}
