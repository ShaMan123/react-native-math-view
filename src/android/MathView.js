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
        paddingHorizontal: PropTypes.number,
        paddingVertical: PropTypes.number,
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
        paddingHorizontal: 10,
        paddingVertical: 5,
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
            return {
                math: nextProps.text,
                webViewLayout: null
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

    render() {
        const { style, containerStyle, onLayout, paddingHorizontal, paddingVertical, ...props } = this.props;
        const { containerLayout, webViewLayout, scale } = this.state;
        
        const size = webViewLayout && scale ? {
            width: webViewLayout.width * scale,
            height: webViewLayout.height * scale
        } : null;

        return (
            <View style={containerStyle}>
                <View
                    style={style}
                >
                    <View
                        style={[StyleSheet.absoluteFill, { backgroundColor: 'blue' }]}
                        onLayout={this._onStubLayout}
                    />
                    <Animated.View
                        style={[{
                            opacity: this.opacityAnimation,
                            transform: [{ scale: this.scaleAnimation }, { perspective: 1000 }],
                            justifyContent: 'center',
                            alignItems: 'center'
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

export default MathView;
