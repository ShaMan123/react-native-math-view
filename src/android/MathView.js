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
import MathViewBase, { MATH_ENGINES } from './MathViewBase';
import ViewOverflow from 'react-native-view-overflow';

class MathView extends React.Component {
    static propTypes = {
        style: ViewPropTypes.style,
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
        ...MathViewBase.propTypes
    };

    static defaultProps = {
        style: null,
        math: '',
        
        onLayoutCompleted: () => { },
        initialOpacity: 0.2,
        initialScale: 0,

        ...MathViewBase.defaultProps
    };

    key = uniqueId('MathView');

    constructor(props) {
        super(props);

        this.state = {
            containerLayout: null,
            webViewLayout: null,
            math: props.math,
            prevMath: null,
            lastMeasured: null,
            scale: props.initialScale,
            stylable: null,
            containerStyle: props.containerStyle,
            prevContainerLayout: null,
            outerContainerLayout: null
        };

        this.opacityAnimation = new Animated.Value(props.initialOpacity);
        this.scaleAnimation = new Animated.Value(props.initialScale);

        this._onStubLayout = this._onStubLayout.bind(this);
        this._onStubContainerLayout = this._onStubContainerLayout.bind(this);
        this._onSizeChanged = this._onSizeChanged.bind(this);

        this.mathRefs = {};
        
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.math !== prevState.math) {
            return {
                math: nextProps.math,
                prevMath: prevState.math,
                webViewLayout: null
            };
        }
        if (nextProps.containerStyle !== prevState.containerStyle) {
            return {
                containerStyle: nextProps.containerStyle,
                prevContainerLayout: prevState.containerLayout,
                containerLayout: null,
                scale: nextProps.initialScale
            }
        }
        return null;
    }

    componentDidUpdate(prevProps, prevState) {
        const { webViewLayout, containerLayout, scale, math, lastMeasured } = this.state;

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
        if (!containerLayout || !webViewLayout) return 0;
        const scale = Math.min(containerLayout.width / webViewLayout.width, containerLayout.height / webViewLayout.height, 1);
        if (scale < this.state.scale) {
            this.opacityAnimation.setValue(0);
            this.scaleAnimation.setValue(0);
        }
        return scale;
    }

    measureStub(containerLayout) {
        const scale = this.getScale({ containerLayout });

        this.setState({
            containerLayout,
            scale
        });
    }

    _onStubLayout(e) {
        const { layout } = e.nativeEvent;
        const { width, height } = layout;
        this.measureStub({ width, height });
    }

    _onStubContainerLayout(e) {

        /*
        this.stub && this.stub.measure((ox, oy, width, height, a, b) => {
            this.measureStub({ width, height });
        });
        */
    }

    _onSizeChanged(math, webViewLayout) {
        const scale = this.getScale({ webViewLayout });
       
        this.setState({
            webViewLayout,
            lastMeasured: math,
            scale,
            stylable: {
                minWidth: webViewLayout.width * scale,
                minHeight: webViewLayout.height * scale
            }
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
    
    get stylableContainer() {
        const { containerLayout, scale } = this.state;

        return containerLayout && scale ? {
            maxWidth: containerLayout.width * scale,
            maxHeight: containerLayout.height * scale
        } : null;
    }
    
    renderBaseView(math, members) {
        const { style, containerStyle, onLayout, ...props } = this.props;
        if (!math) return null;
        const isMeasurer = members.length === 2 && this.state.math === math;
        return (
            <Animated.View
                style={[styles.centerContent, {
                    opacity: this.opacityAnimation,
                    transform: [{ scale: this.scaleAnimation }, { perspective: 1000 }]
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
        const { style, containerStyle } = this.props;
        const { stylable, prevContainerLayout, outerContainerLayout, containerLayout, prevMath, lastMeasured, math } = this.state;
        const members = [math];
        if (lastMeasured === prevMath) members.unshift(prevMath);
        
        return (
            <View
                style={[containerStyle, !containerLayout && { flex: 1, backgroundColor: 'transparent' }]}
                onLayout={(e) => {
                    const { width, height } = e.nativeEvent.layout;
                    this.setState({ outerContainerLayout: { width, height }})
                }}
            >
                <View
                    style={[StyleSheet.absoluteFill, outerContainerLayout, !containerLayout ? { backgroundColor: 'orange' } : { backgroundColor: 'transparent' }]}
                />
                <View
                    style={[style, this.stylable, !containerLayout && { backgroundColor: 'transparent'}]}
                >
                    <View
                        style={[StyleSheet.absoluteFill, prevContainerLayout, !containerLayout ? { backgroundColor: 'blue' } : { backgroundColor: 'transparent' }]}
                    />
                    <View
                        style={[StyleSheet.absoluteFill,{ flex: 1 }]}
                        //ref={(ref) => this.stub = ref}
                        //style={[StyleSheet.absoluteFill, this.stylable]}
                        onLayout={this._onStubLayout}
                    //onLayout={this._onStubLayout}
                    />
                    <FlatList
                        keyExtractor={(math) => `${this.key}:${math}`}
                        data={members}
                        renderItem={({ item }) => this.renderBaseView(item, members)}
                        style={[StyleSheet.absoluteFill, !containerLayout && {opacity: 0}]}
                    />
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
    transient: {
        flex: 1,
        opacity: 0
    }
});

export default MathView;
