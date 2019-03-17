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
} from 'react-native';
import memoize from 'lodash/memoize';
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

    constructor(props) {
        super(props);
        
        this.state = {
            containerLayout: null,
            webViewLayout: null,
            math: props.text
        };

        this.opacityAnimation = new Animated.Value(props.initialOpacity);
        this.scaleAnimation = new Animated.Value(props.initialScale);

        this._onStubLayout = this._onStubLayout.bind(this);
        this._onSizeChanged = this._onSizeChanged.bind(this);
        
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.text !== prevState.math) {
            console.log('------------------------------------------------------------------------------------------------');
            return {
                math: nextProps.text,
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
        const inTransition = !prevState.webViewLayout;
        return aboutToChangeMath && inTransition;
    }

    componentDidUpdate(prevProps, prevState, inTransition) {
        const { webViewLayout, containerLayout, scale, math } = this.state;
        console.log(inTransition)
        if (inTransition) {
            this.opacityAnimation.setValue(0);
        }
        else if (webViewLayout && containerLayout) {
            this.updated = true;
            const animations = [
                Animated.spring(this.opacityAnimation, {
                    toValue: 1,
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
        return scale;
    }

    _onStubLayout(e) {
        const { layout } = e.nativeEvent;
        const { width, height } = layout;
        const containerLayout = { width, height };
        const scale = this.getScale({ containerLayout });
        this.setState({
            containerLayout,
            scale: this.getScale({ containerLayout })
        });
    }

    _onSizeChanged(webViewLayout) {
        this.setState({
            webViewLayout,
            scale: this.getScale({ webViewLayout })
        });
    }

    get stylable() {
        const { webViewLayout, scale } = this.state;

        return webViewLayout && scale ? {
            width: webViewLayout.width * scale,
            height: webViewLayout.height * scale
        } : null;
    }

    render() {
        const { style, containerStyle, onLayout, ...props } = this.props;

        return (
            <View style={containerStyle}>
                <View
                    style={style}
                >
                    <View
                        style={[StyleSheet.absoluteFill]}
                        onLayout={this._onStubLayout}
                    />
                    <Animated.View
                        style={[styles.centerContent, {
                            opacity: this.opacityAnimation,
                            transform: [{ scale: this.scaleAnimation }, { perspective: 1000 }]
                        }]}
                    >
                        <MathViewBase
                            ref={ref => this._handle = ref}
                            {...props}
                            style={[StyleSheet.absoluteFill]}
                            onSizeChanged={this._onSizeChanged}
                            onLayout={(e) => onLayout && onLayout(e)}
                        />
                    </Animated.View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    centerContent: {
        justifyContent: 'center',
        alignItems: 'center'
    }
})

export default MathView;
