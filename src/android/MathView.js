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
            webViewLayout: null
        };

        this.opacityAnimation = new Animated.Value(props.initialOpacity);
        this.scaleAnimation = new Animated.Value(props.initialScale);

        this._onStubLayout = this._onStubLayout.bind(this);
        
    }

    componentDidUpdate(prevProps, prevState) {
        const { webViewLayout, containerLayout } = this.state;
        if (webViewLayout && containerLayout && (!prevState.webViewLayout||prevState.containerLayout)) {
            this.updated = true;

            
            const animations = [
                Animated.spring(this.opacityAnimation, {
                    toValue: 1,
                    useNativeDriver: true
                }),
                Animated.spring(this.scaleAnimation, {
                    toValue: 1,
                    useNativeDriver: true
                })
            ];

            Animated.parallel(animations).start();
        }
    }

    _onStubLayout(e) {
        const { layout } = e.nativeEvent;
        const { width, height } = layout;
        const containerLayout = { width, height };
        if (!this.state.containerLayout) {
            this.setState({
                containerLayout
            });
        }
    }

    render() {
        const { style, onLayout, ...props } = this.props;
        const { containerLayout, webViewLayout } = this.state;
        return (
            <View
                style={style}
            >
                <View
                    style={[/*webViewLayout || */StyleSheet.absoluteFill]}
                    onLayout={this._onStubLayout}
                />
                <Animated.View
                    style={[{ opacity: this.opacityAnimation, transform: [{ scale: this.scaleAnimation }, { perspective: 1000 }] }]}
                >
                    {
                        containerLayout &&
                        <MathViewBase
                            ref={ref => this._handle = ref}
                            {...props}
                            onSizeChanged={(layout) =>/* layout.width!==this.state.webViewLayout.width && */this.setState({ webViewLayout: layout })}
                            containerLayout={containerLayout}
                            onLayout={(e) => onLayout && onLayout(e)}
                        />
                    }

                </Animated.View>
            </View>
        );
    }
}

export default MathView;
