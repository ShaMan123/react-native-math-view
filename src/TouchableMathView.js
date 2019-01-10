'use strict';

import React from 'react';
import PropTypes from 'prop-types';
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
};

const touchables = [TouchableOpacity, TouchableHighlight, TouchableWithoutFeedback];

function getPropTypes() {
    const propTypes = {};
    const defaultPropTypes = {};
    touchables.map((touchable) => {
        Object.assign(propTypes, touchable.propTypes);
        Object.assign(defaultPropTypes, touchable.defaultPropTypes);
    });

    return {
        propTypes,
        defaultPropTypes
    };
}


export default class TouchableMathView extends React.Component {
    static MATH_ENGINES = MATH_ENGINES;
    static propTypes = {
        ...getPropTypes().propTypes,
        ...ScrollView.propTypes,
        style: ViewPropTypes.style,
        scrollViewStyle: ViewPropTypes.style,
        touchableComponent: function (props, propName, componentName) {
            var match = false;
            try {
                const propValue = props[propName];
                match = touchables.findIndex((touchable) => {
                    return touchable.displayName === propValue.type.displayName;
                }) > -1;
            }
            catch (err) {}
            
            if (!match) {
                return new Error(
                    `Invalid prop ${propName} supplied to ${componentName}. Supply one of ${touchables.map((touchable) => { return touchable.displayName }).join(', ')}`
                );
            }
        },
        text: PropTypes.string.isRequired,
        mathEngine: PropTypes.oneOf(Object.keys(MATH_ENGINES).map((key) => { return MATH_ENGINES[key] })),
        verticalScroll: PropTypes.bool,
        horizontalScroll: PropTypes.bool,
        onFullMount: PropTypes.func,
        enableAnimation: PropTypes.bool,
        initialOpacity: function (props, propName, componentName) {
            const propValue = props[propName];
            if (typeof propValue !== 'number' || propValue < 0 || propValue > 1) {
                return new Error(
                    'Invalid prop `' + propName + '` supplied to' +
                    ' `' + componentName + '`. Supply a valid opacity value.'
                );
            }
        }
    };

    static defaultProps = {
        ...getPropTypes().defaultPropTypes,
        ...ScrollView.defaultPropTypes,
        style: null,
        scrollViewStyle: null,
        touchableComponent: <TouchableOpacity />,
        text: '',
        mathEngine: MATH_ENGINES.KATEX,
        verticalScroll: false,
        horizontalScroll: false,
        onFullMount: () => { },
        enableAnimation: true,
        initialOpacity: 0.2
    };

    constructor(props) {
        //  animated opacity can be handled in state with LayoutAnimation or in style with Animated.Value
        //  everything is set just un/comment the style of the ScrollView
        super(props);
        this.state = {
            width: null,
            height: null,
            opacity: props.initialOpacity
        };
        this.opacity = new Animated.Value(props.initialOpacity);
        this.updated = false;
        this.style = {
            opacity: this.opacity,
            alignSelf: 'baseline'
        };
        this.setTouchableComponent = this.setTouchableComponent.bind(this);
        this.setTouchableComponent();
    }

    componentDidUpdate() {
        const { width, height } = this.state;
        if (typeof width === 'number' && typeof height === 'number' && !this.updated) {
            this.updated = true;

            Animated.spring(this.opacity, {
                toValue: 1,
                useNativeDriver: true
            }).start();

            this.getScrollView().scrollToEnd();
            this.props.onFullMount({ width, height });
        }
    }

    get mathString() {
        return Platform.select({
            android: `\\(${this.props.text.replace(/\\\\/g, '\\')}\\)`,
            ios: `\\(${this.props.text.replace(/\\\\/g, '\\')}\\)`
        });
    }

    setTouchableComponent() {
        const { touchableComponent } = this.props;
        var match = false;
        try {
            const { displayName } = touchableComponent.type;
            match = touchables.findIndex((touchable) => {
                return touchable.displayName === displayName;
            }) > -1;
        }
        catch (err) { return; }

        this.touchableComponent = match ? touchableComponent : TouchableMathView.defaultProps.touchableComponent;
    }

    render() {
        const { style, mathEngine, text, scrollViewStyle, contentContainerStyle, enableAnimation } = this.props;
        const { width, height } = this.state;
        const computedStyle = typeof width === 'number' && typeof height === 'number' ? { width, height } : {};

        return (
            <Animated.ScrollView
                ref={ref => this.getScrollView = () => { return ref._component }}
                horizontal
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={[contentContainerStyle]}
                style={[scrollViewStyle, this.style, /*{ opacity: this.state.opacity }*/]}>
                {React.cloneElement(this.touchableComponent, this.props,
                    <View style={[style, { backgroundColor: 'transparent' }]}>
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
                                        vScroll,
                                        opacity: 1
                                    });
                                }
                                else if (e.nativeEvent.hasOwnProperty('touchEvent')) {
                                    this.props.onPress(e.nativeEvent.touchEvent);
                                }
                            }}
                            mathEngine={mathEngine}
                            text={this.mathString}
                        />
                    </View>
                )}
            </Animated.ScrollView>
        );
    }
}


/*
<TouchableComponent {...this.props}>
    <View style={[style, { backgroundColor: 'transparent' }]}>
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
                        vScroll,
                        opacity: 1
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
    */