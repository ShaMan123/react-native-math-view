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
    findNodeHandle, 
    FlatList
} from 'react-native';
import memoize from 'lodash/memoize';
import uniqueId from 'lodash/uniqueId';
import isNil from 'lodash/isNil';
import MathViewBase, { MATH_ENGINES } from './MathViewBase';
import ViewOverflow from 'react-native-view-overflow';

class MathView extends React.Component {
    static propTypes = {
        animated: PropTypes.bool,
        containerStyle: ViewPropTypes.style,
        style: ViewPropTypes.style,
        stubContainerStyle: ViewPropTypes.style,
        stubStyle: ViewPropTypes.style,
        math: PropTypes.string.isRequired,
        onLayout: PropTypes.func,
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
        ...MathViewBase.propTypes,
        extraData: PropTypes.any
    };

    static defaultProps = {
        animated: false,
        containerStyle: null,
        style: null,
        stubContainerStyle: null,
        stubStyle: null,
        math: null,
        
        onLayoutCompleted: () => { },
        initialOpacity: 0.2,
        initialScale: 0,
        extraData: null,

        ...MathViewBase.defaultProps
    };

    static getStyleObject(style) {
        return StyleSheet.flatten(style);
    }

    key = uniqueId('MathView');

    constructor(props) {
        super(props);

        this.state = {
            initialized: false,
            containerLayout: null,
            webViewLayout: null,
            math: props.math,
            prevMath: null,
            lastMeasured: null,
            scale: props.initialScale,
            prevScale: null,
            prevContainerLayout: null,
            outerContainerLayout: null,
            extraData: props.extraData
        };

        this.opacityAnimation = new Animated.Value(props.initialOpacity);
        this.scaleAnimation = new Animated.Value(props.initialScale);

        this._onStubLayout = this._onStubLayout.bind(this);
        this._onContainerLayout = this._onContainerLayout.bind(this);
        this._onSizeChanged = this._onSizeChanged.bind(this);

        this.mathRefs = {};
        
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.math !== prevState.math) {
            return {
                initialized: false,
                math: nextProps.math,
                prevMath: prevState.math,
                webViewLayout: null,
                containerLayout: null,
                prevContainerLayout: prevState.containerLayout,
                scale: nextProps.initialScale,
                prevScale: prevState.scale,
                extraData: nextProps.extraData
            };
        }

        if (nextProps.extraData !== prevState.extraData) {
            return {
                containerLayout: null,
                prevContainerLayout: prevState.containerLayout,
                scale: nextProps.initialScale,
                prevScale: prevState.scale,
                extraData: nextProps.extraData
            };
        }

        return null;
    }

    componentDidUpdate(prevProps, prevState) {
        const { webViewLayout, containerLayout, scale } = this.state;

        if (webViewLayout && containerLayout) {
            this.updated = true;
            const animations = [
                Animated.spring(this.opacityAnimation, {
                    toValue: webViewLayout && containerLayout ? 1 : 0,
                    useNativeDriver: true
                }),
                Animated.spring(this.scaleAnimation, {
                    toValue: scale,
                    useNativeDriver: true
                })
            ];

            Animated.parallel(animations).start();
        }
        
    }
    
    getScale({ containerLayout = this.state.containerLayout, webViewLayout = this.state.webViewLayout }) {
        const currentScale = this.state.scale;
        let initialized, scale;

        const measuringContent = isNil(webViewLayout);
        const measuringContainer = isNil(containerLayout);

        if (measuringContent || measuringContainer) {
            scale = 0;
            if (measuringContent && measuringContainer) {
                initialized = false;
            }
            else {
                initialized = this.state.initialized;
            }
        }
        else {
            scale = Math.min(containerLayout.width / webViewLayout.width, containerLayout.height / webViewLayout.height, 1);
            initialized = true;
            if (scale < this.state.scale) {
                this.opacityAnimation.setValue(0);
                this.scaleAnimation.setValue(0);
            }
        }
        
        return {
            scale,
            prevScale: currentScale,
            initialized
        };
    }

    _onStubLayout(e) {
        const { layout } = e.nativeEvent;
        const { width, height } = layout;
        const containerLayout = { width, height };
        const { scale, prevScale, initialized } = this.getScale({ containerLayout });

        this.setState({
            containerLayout,
            scale,
            prevScale,
            initialized
        });
    }

    _onContainerLayout(e) {
        const measuringContainer = isNil(this.state.containerLayout);
        if (measuringContainer) return;
        const { width, height } = e.nativeEvent.layout;
        this.setState({ outerContainerLayout: { width, height } });
    }

    _onSizeChanged(math, webViewLayout) {
        const { scale, prevScale, initialized } = this.getScale({ webViewLayout });
       
        this.setState({
            webViewLayout,
            lastMeasured: math,
            scale,
            prevScale,
            initialized
        });
        /*
        if (math === this.state.math) {
            
        }
        */
    }

    get stylable() {
        const { webViewLayout, scale } = this.state;

        return webViewLayout && scale ? {
            minWidth: webViewLayout.width * scale,
            minHeight: webViewLayout.height * scale
        } : null;
    }

    renderChangeHandler() {
        const { prevMath, lastMeasured, math } = this.state;
        const members = [math];
        if (lastMeasured === prevMath) members.unshift(prevMath);
        return (
            <FlatList
                keyExtractor={(mathStr) => `${this.key}:${mathStr}`}
                data={members}
                renderItem={({ item }) => this.renderBaseView(item)}
            />
        );
    }
    
    renderBaseView(math) {
        const { style, containerStyle, onLayout, animated, ...props } = this.props;
        if (!math) return null;
        const scale = animated ? this.scaleAnimation : this.state.scale;

        return (
            <Animated.View
                style={[styles.centerContent, {
                    opacity: this.opacityAnimation,
                    transform: [{ scale }, { perspective: 1000 }]
                }]}
            >
                <MathViewBase
                    //ref={ref => this.mathRefs[this.state.math] = ref}
                    {...props}
                    math={math}
                    style={[StyleSheet.absoluteFill]}
                    onSizeChanged={this._onSizeChanged.bind(this, math)}
                    onLayout={(e) => onLayout && onLayout(e)}
                />
            </Animated.View>
        );
    }

    render() {
        const { style, containerStyle, stubContainerStyle, stubStyle } = this.props;
        const { prevContainerLayout, outerContainerLayout, containerLayout, math, webViewLayout, scale, initialized } = this.state;

        const measuringContent = isNil(webViewLayout);
        const measuringContainer = isNil(containerLayout);
        const scaling = measuringContainer && !measuringContent && initialized;
        const measuring = measuringContainer || measuringContent;
        const hideMainViews = initialized ? measuringContainer : measuring;

        return (
            <View
                style={[containerStyle, measuring && styles.default, hideMainViews && styles.transparent]}
                onLayout={this._onContainerLayout}
            >
                <View
                    style={[stubContainerStyle, StyleSheet.absoluteFill, scaling ? outerContainerLayout : styles.transparent]}
                />
                <View
                    style={[style, this.stylable, hideMainViews && styles.transparent]}
                >
                    <View
                        style={[stubStyle, StyleSheet.absoluteFill, scaling ? prevContainerLayout : styles.transparent]}
                    />
                    <View
                        style={[StyleSheet.absoluteFill, styles.default]}
                        onLayout={this._onStubLayout}
                    />
                    <View style={[StyleSheet.absoluteFill, styles.default, styles.centerContent, hideMainViews && styles.invisible]}>
                        {this.renderChangeHandler()}
                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    centerContent: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    default: {
        flex: 1
    },
    transparent: {
        backgroundColor: 'transparent'
    },
    invisible: {
        opacity: 0
    }
});

export default MathView;
