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
        const { webViewLayout, containerLayout } = this.state;
        const toValue = webViewLayout && containerLayout && (!prevState.webViewLayout || prevState.containerLayout) ? 1 : 0;
        this.updated = true;


        const animations = [
            Animated.spring(this.opacityAnimation, {
                toValue: toValue,
                useNativeDriver: true
            }),
            Animated.spring(this.scaleAnimation, {
                toValue: toValue,
                useNativeDriver: true
            })
        ];

        Animated.parallel(animations).start();
    }

    _onStubLayout(e) {
        const { layout } = e.nativeEvent;
        const { width, height } = layout;
        const containerLayout = { width, height };
        this.setState({
            containerLayout
        });
    }

    render() {
        const { style, onLayout, paddingHorizontal, paddingVertical, ...props } = this.props;
        const { containerLayout, webViewLayout } = this.state;
        return (
            <View
                style={[style, webViewLayout]}
                onLayout={this._onStubLayout}
            >
                <Animated.View
                    style={[{
                        opacity: this.opacityAnimation,
                        transform: [{ scale: this.scaleAnimation }, { perspective: 1000 }],
                        justifyContent: 'center',
                        alignItems: 'center'
                    }]}
                >
                    {
                        containerLayout &&
                        <MathViewBase
                            ref={ref => this._handle = ref}
                            {...props}
                            style={StyleSheet.absoluteFill}
                            onSizeChanged={(layout) => this.setState({ webViewLayout: layout })}
                            containerLayout={{ width: Math.max(containerLayout.width - paddingHorizontal * 2, 0), height: containerLayout.height + paddingVertical * 2 }}
                            onLayout={(e) => onLayout && onLayout(e)}
                        />
                    }

                </Animated.View>
            </View>
        );
    }
}

export default MathView;
