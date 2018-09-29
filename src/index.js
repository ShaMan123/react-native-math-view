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
    Animated
} from 'react-native'

//const { RNMathTextView } = NativeModules;

const RNMathTextView = requireNativeComponent('RNMathTextView', MathTextView, {
    nativeOnly: {
        nativeID: true,
        onChange: true
    }
});

const MathTextViewManager = NativeModules.RNMathTextViewManager || {};

const MATH_ENGINES = {
    KATEX: 'KATEX',
    MATHJAX: 'MATHJAX'
}

export default class MathTextView extends React.Component {
    static MATH_ENGINES = MATH_ENGINES;
    static propTypes = {
        style: ViewPropTypes.style,
        text: PropTypes.string.isRequired,
        mathEngine: PropTypes.oneOf(Object.keys(MATH_ENGINES).map((key) => { return MATH_ENGINES[key] })),
        verticalScroll: PropTypes.bool,
        horizontalScroll: PropTypes.bool,
    };

    static defaultProps = {
        style: null,
        text: '',
        mathEngine: MATH_ENGINES.KATEX,
        vScroll: true,
        hScroll: true,
    };

    constructor(props) {
        super(props);
        this.state = {
            width: null,
            height: null,
        }
        this.opacity = new Animated.Value(0);
        this.updated = false;
    }

    componentDidUpdate() {
        const { width, height } = this.state;
        if (typeof width === 'number' && typeof height === 'number' && !this.updated) {
            this.updated = true;
            Animated.spring(this.opacity, {
                toValue: 1,
                useNativeDriver: true,
            }).start();
        }
    }
    
    render() {
        const { style, mathEngine, text } = this.props;
        const { width, height, hScroll, vScroll } = this.state;
        var computedStyle = {};
        var scrollProps = null;
        if (typeof width === 'number' && typeof height === 'number') {
            computedStyle = {
                width,
                height,
            };
            scrollProps = {
                verticalScroll: vScroll,
                horizontalScroll: hScroll
            }
        }

        return (
            <Animated.View style={{ opacity: this.opacity }}>
                <RNMathTextView
                    ref={ref => this._handle = ReactNative.findNodeHandle(ref)}
                    style={[style, computedStyle]}
                    onChange={(e) => {
                        if (e.nativeEvent.hasOwnProperty('onSizeChanged')) {
                            const sizeObj = e.nativeEvent.size;
                            const dimensions = Dimensions.get('window');
                            const width = parseInt(sizeObj.width);
                            const height = parseInt(sizeObj.height);
                            const hScroll = dimensions.width < width;
                            const vScroll = dimensions.height < height;
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
                    {...scrollProps}
                />
            </Animated.View>
        );
    }
}
