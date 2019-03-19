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
import omit from 'lodash/omit';
import assign from 'lodash/assign';

import MathViewBase, { MATH_ENGINES } from './MathViewBase';

const actions = {
    contentLayout: 'contentLayout',
    contentContainerLayout: 'contentContainerLayout',
    containerLayout: 'containerLayout',
    changeMath: 'changeMath',
    extraData: 'extraData'
};

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
            containerLayout: null,
            extraData: props.extraData,
            prevCycle: null,
            action: null,
            actions: []
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
        const common = {
            //initialized: false,
            //containerLayout: null,
            //contentContainerLayout: null,
            //scale: nextProps.initialScale,
            extraData: nextProps.extraData,
            prevCycle: omit(prevState, 'prevCycle')
            
        };

        if (nextProps.math !== prevState.math) {
            return {
                ...common,
                initialized: false,
                math: nextProps.math,
                prevMath: prevState.math,
                contentLayout: null,
                action: actions.changeMath,
                actions: [actions.changeMath]
            };
        }

        if (nextProps.extraData !== prevState.extraData) {
            return {
                ...common,
                action: actions.extraData,
                actions: [actions.extraData]
            };
        }

        return null;
    }

    componentDidUpdate(prevProps, prevState) {
        const { contentLayout, contentContainerLayout, scale, initialized, prevCycle } = this.state;
        const measuringContent = isNil(contentLayout);
        const measuringContainer = isNil(contentContainerLayout);
        const measuring = measuringContainer || measuringContent;

        if (!measuring && initialized) {
            const animations = [
                Animated.spring(this.scaleAnimation, {
                    toValue: scale,
                    useNativeDriver: true
                    //duration: initialized? 100: 500
                }),
                Animated.spring(this.opacityAnimation, {
                    toValue: contentLayout && contentContainerLayout ? 1 : 0,
                    useNativeDriver: true
                })
            ];

            Animated.stagger(250, animations)
                .start(() => {
                    //completedUpdateCycle && this._fireLayoutEvent();
                });
        }
        
    }

    layoutReducer(action, layout) {
        if (!actions[action]) {
            console.error('unknown action', action);
        }
        else {
            const actionFlow = this.state.actions;
            let initialized, scale, state;
            const contentLayout = action === actions.contentLayout ? layout : this.state.contentLayout;
            const contentContainerLayout = action === actions.contentContainerLayout ? layout : this.state.contentContainerLayout;
            const containerLayout = action === actions.containerLayout ? layout : this.state.containerLayout;

            const measuringContent = isNil(contentLayout);
            const measuringContainer = isNil(contentContainerLayout);

            actionFlow.push(action);

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

            const baseState = {
                action,
                actions: actionFlow,
                [action]: layout
            };

            const scaleReducer = {
                scale,
                initialized
            };

            
            switch (action) {
                case actions.contentLayout:
                    state = assign(baseState, scaleReducer);
                    break;
                case actions.contentContainerLayout:
                    state = assign(baseState, scaleReducer);
                    break;
                case actions.containerLayout:
                    state = baseState;
                    break;
            }
            
            return state;
        }
       
    }

    _onContentLayout(math, contentLayout) {
        const state = this.layoutReducer(actions.contentLayout, contentLayout);
        this.setState(assign(state, { lastMeasured: math }));
        /*
        if (math === this.state.math) {
            
        }
        */
    }

    _onContentContainerLayout(e) {
        const { width, height } = e.nativeEvent.layout;
        const state = this.layoutReducer(actions.contentContainerLayout, { width, height });

        this.setState(state);
    }

    _onContainerLayout(e) {
        e.persist();
        this._layoutEvent = e;

        const { width, height } = e.nativeEvent.layout;
        const state = this.layoutReducer(actions.containerLayout, { width, height });

        this.setState(state);

        /*const measuringContainer = isNil(this.state.contentContainerLayout);

         *  this._layoutEvent = null;
        if (!measuringContainer) {
            
        }
        */
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

    get transitionStylable() {
        const { contentLayout } = this.state;
        const scale = 1;

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
                //style={styles.default}
                //contentContainerStyle={[styles.centerContent]}
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
    measureFromOutsideIn() {
        const { style, containerStyle, stubContainerStyle, stubStyle } = this.props;
        const { containerLayout, contentContainerLayout, math, contentLayout, scale, initialized, prevCycle } = this.state;

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
                        style={[stubStyle, StyleSheet.absoluteFill, scaling ? prevCycle && prevCycle.contentContainerLayout : styles.transparent]}
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
    measureFromInsideOut() {

        const { style, containerStyle, stubContainerStyle, stubStyle, extraData } = this.props;
        const { containerLayout, contentContainerLayout, math, contentLayout, scale, initialized, prevCycle } = this.state;

        const measuringContent = isNil(contentLayout);
        const measuringContainer = isNil(contentContainerLayout);
        const scaling = measuringContainer && !measuringContent && initialized;
        const measuring = measuringContainer || measuringContent;
        const hideMainViews = initialized ? measuringContainer : measuring;

        return (
            <Animated.View
                style={[containerStyle, /*contentLayout,*/ hideMainViews && styles.transparent, {opacity: this.opacityAnimation}]}
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
                    <View style={[style, this.transitionStylable, StyleSheet.absoluteFill, styles.default, extraData && { maxWidth: extraData }, styles.transparent]}>
                        <View
                            style={[/*style,*/ styles.default]}
                            onLayout={this._onContentContainerLayout}
                        />
                    </View>
                    <View style={[StyleSheet.absoluteFill, styles.default,styles.centerContent, hideMainViews && styles.invisible]}>
                        <View style={[styles.default, styles.centerContent]}>
                            {this.renderChangeHandler()}
                        </View>
                    </View>
                </View>
            </Animated.View>
        );
    }

    render() {
        console.log(this.state);
        console.log(this.stylable);
        console.log('___________________________________________________')
        return this.measureFromInsideOut();
    }
}

const styles = StyleSheet.create({
    centerContent: {
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row'
    },
    adjustDirection: {
        flexDirection: 'row'
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
