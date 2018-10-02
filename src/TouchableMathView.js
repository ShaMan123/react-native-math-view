'use strict';

import React from 'react'
import PropTypes from 'prop-types'
import ReactNative, {
    requireNativeComponent,
    NativeModules,
    UIManager,
    PanResponder,
    PixelRatio,
    Platform,
    ViewPropTypes,
    processColor,
    Dimensions,
    Animated,
    View,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TouchableHighlight,
    TouchableWithoutFeedback,
    LayoutAnimation
} from 'react-native';

const RNMathTextView = requireNativeComponent('RNMathView', TouchableMathView, {
    nativeOnly: {
        nativeID: true,
        onChange: true
    }
});

const MathTextViewManager = NativeModules.RNMathViewManager || {};

const MATH_ENGINES = {
    KATEX: 'KATEX',
    MATHJAX: 'MATHJAX'
}

const touchableClasses = {
    TouchableOpacity: TouchableOpacity,
    TouchableHighlight: TouchableHighlight,
    TouchableWithoutFeedback: TouchableWithoutFeedback,
}

function getPropTypes() {
    const propTypes = {};
    const defaultPropTypes = {};
    Object.keys(touchableClasses).map((key) => {
        Object.assign(propTypes, touchableClasses[key].propTypes);
        Object.assign(defaultPropTypes, touchableClasses[key].defaultPropTypes);
    })

    return {
        propTypes,
        defaultPropTypes
    }
}


export default class TouchableMathView extends React.Component {
    static MATH_ENGINES = MATH_ENGINES;
    static propTypes = {
        ...getPropTypes().propTypes,
        ...ScrollView.propTypes,
        style: ViewPropTypes.style,
        scrollViewStyle: ViewPropTypes.style,
        touchableComponent: PropTypes.oneOf([...Object.keys(touchableClasses), ...Object.keys(touchableClasses).map((key) => { return touchableClasses[key] })]),
        text: PropTypes.string.isRequired,
        mathEngine: PropTypes.oneOf(Object.keys(MATH_ENGINES).map((key) => { return MATH_ENGINES[key] })),
        verticalScroll: PropTypes.bool,
        horizontalScroll: PropTypes.bool,
        onFullMount: PropTypes.func,
        enableAnimation: PropTypes.bool
    };

    static defaultProps = {
        ...getPropTypes().defaultPropTypes,
        ...ScrollView.defaultPropTypes,
        style: null,
        scrollViewStyle: null,
        touchableComponent: touchableClasses.TouchableOpacity,
        text: '',
        mathEngine: MATH_ENGINES.KATEX,
        verticalScroll: false,
        horizontalScroll: false,
        onFullMount: () => { },
        enableAnimation: true
    };

    constructor(props) {
        super(props);
        this.state = {
            width: null,
            height: null,
        }
        this.opacity = new Animated.Value(0);
        this.updated = false;
        this.style = {
            opacity: this.opacity,
            alignSelf: 'baseline',
        }
    }

    componentDidUpdate() {
        const { width, height } = this.state;
        if (typeof width === 'number' && typeof height === 'number' && !this.updated) {
            this.updated = true;
            Animated.spring(this.opacity, {
                toValue: 1,
                useNativeDriver: true,
            }).start();
            this.getScrollView().scrollToEnd();
            this.props.onFullMount({ width, height });
        }
    }

    render() {
        const { style, mathEngine, text, scrollViewStyle, contentContainerStyle, touchableComponent, enableAnimation } = this.props;
        const { width, height } = this.state;
        const TouchableComponent = typeof touchableComponent === 'string' ? touchableClasses[touchableComponent] : touchableComponent;
        const computedStyle = typeof width === 'number' && typeof height === 'number' ? { width, height } : {};

        return (
            <Animated.ScrollView
                ref={ref => this.getScrollView = () => { return ref._component }}
                horizontal
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={[contentContainerStyle]}
                style={[scrollViewStyle, this.style]}>
                <TouchableComponent {...this.props}>
                    <View style={[style]}>
                        <RNMathTextView
                            ref={ref => this._handle = ReactNative.findNodeHandle(ref)}
                            {...this.props}
                            style={computedStyle}
                            onChange={(e) => {
                                if (e.nativeEvent.hasOwnProperty('onSizeChanged')) {
                                    const sizeObj = e.nativeEvent.size;
                                    const dimensions = Dimensions.get('window');
                                    const width = parseInt(sizeObj.width);
                                    const height = parseInt(sizeObj.height);
                                    const hScroll = dimensions.width < width;
                                    const vScroll = dimensions.height < height;
                                    if (enableAnimation) LayoutAnimation.spring();
                                    this.setState({
                                        width,
                                        height,
                                        hScroll,
                                        vScroll
                                    });
                                }
                                else if (e.nativeEvent.hasOwnProperty('touchEvent')) {
                                    this.props.onPress(e.nativeEvent.touchEvent)
                                }
                            }}
                            mathEngine={mathEngine}
                            text={text.replace(/\\\\/g, '\\')}
                        />
                    </View>
                </TouchableComponent>
            </Animated.ScrollView>
        );
    }
}

