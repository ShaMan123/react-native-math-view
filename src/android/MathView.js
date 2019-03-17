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
import MathViewBase, { MATH_ENGINES} from './MathViewBase';

class MathView extends React.Component {
    static propTypes = {
        style: ViewPropTypes.style,
        text: PropTypes.string.isRequired,
       
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
        layoutProvider: PropTypes.any,
        ...MathViewBase.propTypes
    };

    static defaultProps = {
        style: null,
        text: '',
        
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
            math: props.text,
            prevMath: null,
            lastMeasured: null,
            scale: props.initialScale
        };

        this.opacityAnimation = new Animated.Value(props.initialOpacity);
        this.scaleAnimation = new Animated.Value(props.initialScale);

        this._onStubLayout = this._onStubLayout.bind(this);
        this._onSizeChanged = this._onSizeChanged.bind(this);

        this.mathRefs = {};
        
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.text !== prevState.math) {
            return {
                math: nextProps.text,
                prevMath: prevState.math,
                webViewLayout: null
            };
        }
        return null;
    }

    getSnapshotBeforeUpdate(prevProps, prevState) {
        /*
        const { math } = this.state;
        console.log(prevProps)
        console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@');
        console.log(this.props)
        console.log('##############################################');
        console.log(prevState)
        console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@');
        console.log(this.state)
        console.log('______________________________________________________________');
        */
        const aboutToChangeMath = this.state.math !== prevState.math;
        const inTransition = !prevState.webViewLayout || prevState.scale>this.state.scale;
        return aboutToChangeMath && inTransition;
    }

    componentDidUpdate(prevProps, prevState, inTransition) {
        const { webViewLayout, containerLayout, scale, math, lastMeasured } = this.state;
        console.log('cc', math, scale)
        /*
        if (prevState.scale > this.state.scale) {
            this.scaleAnimation.setValue(0);
        }
        */
        
        
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

    _onStubLayout(e) {
        const { layout } = e.nativeEvent;
        const { width, height } = layout;
        const containerLayout = { width, height };
        const scale = this.getScale({ containerLayout });
        
        this.setState({
            containerLayout,
            scale
        });
    }

    _onSizeChanged(math, webViewLayout) {
        const scale = this.getScale({ webViewLayout });
       
        this.setState({
            webViewLayout,
            lastMeasured: math,
            scale
        });
        /*
        if (math === this.state.math) {
            
        }
        */
    }

    get stylable() {
        const { webViewLayout, scale } = this.state;

        return webViewLayout && scale ? {
            width: webViewLayout.width * scale,
            height: webViewLayout.height * scale
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
                    text={math}
                    style={[StyleSheet.absoluteFill]}
                    onSizeChanged={this._onSizeChanged.bind(this, math)}
                    onLayout={(e) => onLayout && onLayout(e)}
                />
            </Animated.View>
        );
    }

    render() {
        const { style, containerStyle, onLayout, ...props } = this.props;
        const members = this.state.lastMeasured === this.state.math ? [this.state.math] : [this.state.prevMath, this.state.math];
        return (
            <View style={containerStyle}>
                <View
                    style={style}
                >
                    <View
                        style={[StyleSheet.absoluteFill]}
                        onLayout={this._onStubLayout}
                    />

                    <FlatList
                        keyExtractor={(math) => `${this.key}:${math}`}
                        data={members}
                        renderItem={({ item }) => this.renderBaseView(item, members)}
                        //contentContainerStyle={[{ display: 'flex' }]}
                        //style={{alignSelf:'center'}}
                    />

                </View>
            </View>
        );
    }
}

/*
 * 
 * {this.state.lastMeasured === this.state.prevMath && this.renderBaseView(this.state.prevMath)}
                        {this.renderBaseView(this.state.math)}


 <FlatList
                            style={{ backgroundColor: 'orange'}}
                            keyExtractor={(math) => `${this.key}:${math}`}
                            data={members}
                            renderItem={({ item }) => this.renderBaseView(item)}
                            //contentContainerStyle={{display:'flex'}}
                        />
*/

const styles = StyleSheet.create({
    centerContent: {
        justifyContent: 'center',
        alignItems: 'center'
    }
})

export default MathView;
