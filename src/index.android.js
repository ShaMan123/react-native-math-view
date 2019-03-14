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
    findNodeHandle
} from 'react-native';

import memoize from 'lodash/memoize';

const RNMathView = requireNativeComponent('RNMathView', MathView, {
    nativeOnly: {
        nativeID: true,
        onChange: true
    }
});

const MathViewManager = NativeModules.RNMathViewManager || {};

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
        flex: 1
    },
    tag: {
        marginHorizontal: 10
    }
});


class MathView extends React.Component {
    static MATH_ENGINES = MATH_ENGINES;
    static propTypes = {
        style: ViewPropTypes.style,
        text: PropTypes.string.isRequired,
        mathEngine: PropTypes.oneOf(Object.keys(MATH_ENGINES).map((key) => { return MATH_ENGINES[key] })),
        onLayoutCompleted: PropTypes.func,
        initialOpacity: function (props, propName, componentName) {
            const propValue = props[propName];
            if (typeof propValue !== 'number' || propValue < 0 || propValue > 1) {
                return new Error(
                    'Invalid prop `' + propName + '` supplied to' +
                    ' `' + componentName + '`. Supply a valid opacity value.'
                );
            }
        },
        initialScale: PropTypes.number,
        layoutProvider: PropTypes.any.isRequired
    };

    static defaultProps = {
        style: null,
        text: '',
        mathEngine: MATH_ENGINES.KATEX,
        onLayoutCompleted: () => { },
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
            ...MathView.memoize(this.props.text),
            containerLayout: null
        };

        this.opacityAnimation = new Animated.Value(props.initialOpacity);
        this.scaleAnimation = new Animated.Value(props.initialScale);
        this.updated = false;
        this.style = {
            opacity: this.opacityAnimation,
            transform: [{ scale: this.scaleAnimation }, { perspective: 1000 }]
        };

        this._onChange = this._onChange.bind(this);
        this._onLayout = this._onLayout.bind(this);
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.layoutProvider.width && nextProps.layoutProvider !== prevState.layoutProvider) {
            return {
                containerLayout: nextProps.layoutProvider
            };
        }
        return null;
    }

    componentDidMount() {
        this.measureLayout();
    }

    componentDidUpdate(prevProps, prevState) {
        const { width, height, containerLayout } = this.state;
        if (width && containerLayout && (!this.scaleValue || containerLayout.width !== prevState.containerLayout.width)) {
            const scale = (containerLayout.width - 20) / width;
            this.scaleValue = scale;
            MathView.memoize.cache.set(this.props.text, { width, height });
            const animations = [
                Animated.spring(this.opacityAnimation, {
                    toValue: 1,
                    useNativeDriver: true
                }),
                Animated.spring(this.scaleAnimation, {
                    toValue: scale < 1 ? scale : 1,
                    useNativeDriver: true
                })
            ];

            // works beautifully => but causes web view to re-calculate it's size resulting in infinte state updates
            // if flexWrap will work this method should replace scaling the view with Animated
            //this._handle.setNativeProps({ fontShrink: scale });

            Animated.parallel(animations).start(() => {
                const e = this.e;
                e.nativeEvent.layout.width = Math.round(width * scale);
                e.nativeEvent.layout.height = Math.round(height * scale);
                e.nativeEvent.scale = scale < 1 ? scale : 1;
                this.props.onLayoutCompleted(this.e);
            });
        }
        if (typeof width === 'number' && typeof height === 'number' && !this.updated) {
            this.updated = true;
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

    measureRef() {
        try {
            this.props.layoutProvider.current.measure((ox, oy, width, height, px, py) => this.setContainerLayout(width, height));
        }
        catch (err) {
            console.error(err.message);
        }
    }

    async measureLayout() {
        let i = 0;
        const { layoutProvider } = this.props;
        if (typeof layoutProvider === 'function') {
            let { width, height } = await Promise.resolve(layoutProvider());
            this.setContainerLayout(width, height);
        }
        else if (layoutProvider.width) {
            this.setContainerLayout(layoutProvider.width, layoutProvider.height);
        }
        else {
            const interval = setInterval(() => {
                if (layoutProvider.current && layoutProvider.current.measure) {
                    clearInterval(interval);
                    this.measureRef();
                }
                else if (i < 5) {
                    i++;
                }
                else {
                    clearInterval(interval);
                    console.warn('RNMathView: The provided ref is not measurable');
                    const { width, height } = Dimensions.get('window');
                    this.setContainerLayout(width, height);
                }
            }, 50);
        }
    }

    get isStaticRenderingMode() {
        const { layoutProvider } = this.props;
        return layoutProvider && layoutProvider.width ? true : false;
    }

    setContainerLayout(width, height) {
        const staticRendering = this.isStaticRenderingMode;
        this.setState({
            containerLayout: {
                width: staticRendering ? Math.min(width, height) : width,
                height: staticRendering ? Math.max(width, height) : height
            }
        });
    }

    _onLayout(e) {
        e.persist();
        this.e = e;
        if (this.layout && e.nativeEvent.layout.width !== this.layout.width) setTimeout(() => this.measureLayout(), 0);
        this.layout = e.nativeEvent.layout;
    }

    render() {
        const { style, mathEngine } = this.props;
        const { width, height, containerLayout } = this.state;
        if (!containerLayout) return null;

        const computedStyle = typeof width === 'number' && typeof height === 'number' ? { width, height } : {};

        return (
            <View style={[styles.wrapper, style]}
                onLayout={this._onLayout}
            >
                <Animated.View
                    style={this.style}
                >
                    <RNMathView
                        ref={ref => this._handle = ref}
                        {...this.props}
                        style={[styles.tag, computedStyle]}
                        onChange={this._onChange}
                        mathEngine={mathEngine}
                        text={this.mathString}
                        verticalScroll={false}
                        horizontalScroll={false}
                        containerLayout={containerLayout}
                    />
                </Animated.View>
            </View>
        );
    }
}

export default MathView;
