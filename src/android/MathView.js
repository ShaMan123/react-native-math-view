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
import * as _ from 'lodash';
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
            contentContainerLayout: null,
            contentLayout: null,
            math: props.math,
            prevMath: null,
            lastMeasured: null,
            scale: props.initialScale,
            prevContentContainerLayout: null,
            containerLayout: null,
            extraData: props.extraData,
            prevCycle: null,
            lastUpdated: null
        };

        this.opacityAnimation = new Animated.Value(props.initialOpacity);
        this.scaleAnimation = new Animated.Value(props.initialScale);

        this._onContentContainerLayout = this._onContentContainerLayout.bind(this);
        this._onContainerLayout = this._onContainerLayout.bind(this);
        this._onContentLayout = this._onContentLayout.bind(this);

        this.mathRefs = {};
        this._layoutEvent = null;
        this._nativeDidLayout = false;
        
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.math !== prevState.math) {
            return {
                initialized: false,
                math: nextProps.math,
                prevMath: prevState.math,
                contentLayout: null,
                contentContainerLayout: null,
                prevContentContainerLayout: prevState.contentContainerLayout,
                scale: nextProps.initialScale,
                extraData: nextProps.extraData,
                prevCycle: _.omit(prevState, 'prevCycle'),
                lastUpdated: null
            };
        }

        if (nextProps.extraData !== prevState.extraData) {
            return {
                //containerLayout: null,
                contentContainerLayout: null,
                prevContentContainerLayout: prevState.contentContainerLayout,
                scale: nextProps.initialScale,
                extraData: nextProps.extraData,
                prevCycle: _.omit(prevState, 'prevCycle'),
                lastUpdated: null
            };
        }

        return null;
    }

    componentDidUpdate(prevProps, prevState) {
        const { contentLayout, contentContainerLayout, scale, initialized, prevCycle, lastUpdated } = this.state;
        const measuringContent = isNil(contentLayout);
        const measuringContainer = isNil(contentContainerLayout);
        const measuring = measuringContainer || measuringContent;

        if (prevCycle) {
            const changedLayoutByScaling = this.state.initialized && prevCycle.initialized && scale !== prevCycle.scale;
            const changeLayoutByChanging = !this.state.prevMath || this.state.math !== prevCycle.math;
            const completedUpdateCycle = initialized /*&& scale === prevScale;*/

            const shouldFireLayoutEvent = completedUpdateCycle && (changedLayoutByScaling || changeLayoutByChanging);
        }
        


        //this._layoutEvent && console.log(lastUpdated, this._layoutEvent.nativeEvent);

        if (!measuring) {
            this.updated = true;
            const animations = [
                Animated.spring(this.opacityAnimation, {
                    toValue: contentLayout && contentContainerLayout ? 1 : 0,
                    useNativeDriver: true
                }),
                Animated.spring(this.scaleAnimation, {
                    toValue: scale,
                    useNativeDriver: true
                })
            ];

            

            Animated.parallel(animations)
                .start(() => {
                    //completedUpdateCycle && this._fireLayoutEvent();
                });
        }
        
    }
    
    getScale({ contentContainerLayout = this.state.contentContainerLayout, contentLayout = this.state.contentLayout }) {
        //const currentScale = this.state.scale;
        let initialized, scale;

        const measuringContent = isNil(contentLayout);
        const measuringContainer = isNil(contentContainerLayout);

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
            scale = Math.min(contentContainerLayout.width / contentLayout.width, contentContainerLayout.height / contentLayout.height, 1);
            initialized = true;
            if (scale < this.state.scale) {
                this.opacityAnimation.setValue(0);
                this.scaleAnimation.setValue(0);
            }
        }
        
        return {
            scale,
            initialized
        };
    }

    _onContentLayout(math, contentLayout) {
        const { scale, initialized } = this.getScale({ contentLayout });

        this.setState({
            contentLayout,
            lastMeasured: math,
            scale,
            initialized,
            lastUpdated: 'contentLayout'
        });
        /*
        if (math === this.state.math) {
            
        }
        */
    }

    _onContentContainerLayout(e) {
        const { layout } = e.nativeEvent;
        const { width, height } = layout;
        const contentContainerLayout = { width, height };
        const { scale, initialized } = this.getScale({ contentContainerLayout });
        //console.log('@#@#@#', width, height)
        this.setState({
            contentContainerLayout,
            scale,
            initialized,
            lastUpdated: 'contentContainerLayout'
        });
    }

    _onContainerLayout(e) {
        const measuringContainer = isNil(this.state.contentContainerLayout);
        this._layoutEvent = null;
        //console.log('!!!!!', this.stylable)

        e.persist();
        this._layoutEvent = e;
        const { width, height } = e.nativeEvent.layout;
        this.setState({
            containerLayout: { width, height },
            lastUpdated: 'containerLayout'
        });

        if (!measuringContainer) {
            
        }
    }

    _fireLayoutEvent() {
        const { onLayout } = this.props;
        if (!isNil(this._layoutEvent) && !isNil(onLayout) && this._nativeDidLayout) {
            onLayout(this._layoutEvent);
            this._layoutEvent = null;
        }
    }

    get stylable() {
        const { contentLayout, scale } = this.state;

        return contentLayout && scale ? {
            minWidth: contentLayout.width * scale,
            minHeight: contentLayout.height * scale
        } : null;
    }

    get prevStylable() {
        const { prevCycle } = this.state;
        const { scale, contentLayout } = prevCycle;
        return contentLayout && scale ? {
            minWidth: contentLayout.width * scale,
            minHeight: contentLayout.height * scale
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
                style={[styles.default, styles.centerContent, {
                    opacity: this.opacityAnimation,
                    transform: [{ scale }, { perspective: 1000 }]
                }]}
            >
                <MathViewBase
                    //ref={ref => this.mathRefs[this.state.math] = ref}
                    {...props}
                    math={math}
                    style={[StyleSheet.absoluteFill]}
                    onSizeChanged={this._onContentLayout.bind(this, math)}
                    onLayout={() => this._nativeDidLayout = true}
                />
            </Animated.View>
        );
    }

    /**self-measuring flex view */
    render10() {
        const { style, containerStyle, stubContainerStyle, stubStyle } = this.props;
        const { prevContentContainerLayout, containerLayout, contentContainerLayout, math, contentLayout, scale, initialized } = this.state;

        const measuringContent = isNil(contentLayout);
        const measuringContainer = isNil(contentContainerLayout);
        const scaling = measuringContainer && !measuringContent && initialized;
        const measuring = measuringContainer || measuringContent;
        const hideMainViews = initialized ? measuringContainer : measuring;

        return (
            <View
                style={[containerStyle, measuring && styles.default, hideMainViews && styles.transparent]}
                onLayout={this._onContainerLayout}
            >
                <View
                    style={[stubContainerStyle, StyleSheet.absoluteFill, scaling ? containerLayout : styles.transparent]}
                />
                <View
                    style={[style, this.stylable, hideMainViews && styles.transparent]}
                >
                    <View
                        style={[stubStyle, StyleSheet.absoluteFill, scaling ? prevContentContainerLayout : styles.transparent]}
                    />
                    <View
                        style={[StyleSheet.absoluteFill, styles.default]}
                        onLayout={this._onContentContainerLayout}
                    />
                    <View style={[StyleSheet.absoluteFill, styles.default, styles.centerContent, hideMainViews && styles.invisible]}>
                        {this.renderChangeHandler()}
                    </View>
                </View>
            </View>
        );
    }

    /**flexWrap */
    render() {

        const { style, containerStyle, stubContainerStyle, stubStyle, extraData } = this.props;
        const { prevContentContainerLayout, containerLayout, contentContainerLayout, math, contentLayout, scale, initialized, prevCycle } = this.state;

        const measuringContent = isNil(contentLayout);
        const measuringContainer = isNil(contentContainerLayout);
        const scaling = measuringContainer && !measuringContent && initialized;
        const measuring = measuringContainer || measuringContent;
        const hideMainViews = initialized ? measuringContainer : measuring;

        return (
            <View
                style={[containerStyle, /*contentLayout,*/ hideMainViews && styles.transparent]}
                onLayout={this._onContainerLayout}
            >
                <View
                    style={[stubContainerStyle, StyleSheet.absoluteFill, scaling ? prevCycle.containerLayout : styles.invisible]}
                />
                <View
                    style={[style, this.stylable, /*styles.default,*/ hideMainViews && styles.transparent]}
                >
                    <View
                        style={[stubStyle, StyleSheet.absoluteFill, /*styles.default,*/ scaling ? this.prevStylable : styles.transparent]}
                    />
                    <View style={[style, StyleSheet.absoluteFill, contentLayout, styles.default, extraData && { maxWidth: extraData }, styles.transparent]}>
                        <View
                            style={[/*style,*/ styles.default]}
                            onLayout={this._onContentContainerLayout}
                        />
                    </View>
                    <View style={[StyleSheet.absoluteFill, styles.default, hideMainViews && styles.invisible, {backgroundColor:'red'}]}>
                        <View style={[{ flex: 1, justifyContent:'center' }]}>
                            {this.renderBaseView(math)}
                        </View>
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
        //opacity: 0
    }
});

export default MathView;
