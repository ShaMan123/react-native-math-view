'use strict';

import * as _ from 'lodash';
import React, { forwardRef, useCallback, useMemo, useState, useEffect } from 'react';
import { Dimensions, LayoutChangeEvent, NativeModules, requireNativeComponent, StyleSheet, UIManager, View, ViewProps, Animated, ViewStyle } from 'react-native';
import { useCalculatedStyle } from '../CalculatedStyle';
import { MathToSVGConfig, ResizeMode } from '../Config';
import { mathToSVG } from '../MathProvider';

const nativeViewName = 'RNSVGMathView';
const RNMathView = requireNativeComponent(nativeViewName);
const MathViewManager = NativeModules.RNMathViewManager || {};
export const { Constants } = UIManager.getViewManagerConfig ? UIManager.getViewManagerConfig(nativeViewName) : UIManager[nativeViewName];


export interface MathViewProps extends ViewProps {
    math: string,

    /**
     * set text color
     * can be set via `setNativeProps`
     * */
    color?: string,

    /**
     * set to `true` to fit the view to it's parent
     * defaults to `false`
     * */
    scaleToFit?: boolean,

    /**
     * defaults to 'center'
     * */
    resizeMode?: ResizeMode,

    config?: MathToSVGConfig
}

function defaultPropSize(flatStyle: ViewStyle, key: keyof ViewStyle, defaultValue: number) {
    const propVal = _.get(flatStyle, key, '');
    return _.isNumber(propVal) ? Math.min(defaultValue, propVal) : defaultValue;
}

function MathView(props: MathViewProps, ref: any) {
    if (!props.math) return null;
    const fStyle = useMemo(() => StyleSheet.flatten(props.style), [props.style]);
    const flexWrap = _.get(fStyle, 'flexWrap', '');

    const [layout, setLayout] = useState(() => {
        const { width, height } = Dimensions.get('window');
        return {
            width: defaultPropSize(fStyle, 'maxWidth', width),
            height: defaultPropSize(fStyle, 'maxHeight', height),
            initialized: false
        };
    });
    const onLayout = useCallback((e: LayoutChangeEvent) => {
        const { width, height } = e.nativeEvent.layout;
        
        if (props.scaleToFit && (flexWrap === 'nowrap' || flexWrap === '')) {
            setLayout({
                width,
                height,
                initialized: true
            });
        }
    }, [props.scaleToFit, flexWrap]);

    const opacity = useMemo(() => new Animated.Value(0), []);
    useEffect(() => {
        Animated
            .timing(opacity, {
                toValue: 1,
                useNativeDriver: true
            })
            .start();
    }, []);

    const data = useMemo(() => mathToSVG(props.math), [props.math]);

    const config = _.assign({}, props.config, {
        minWidth: _.get(fStyle, 'minWidth', undefined),
        minHeight: _.get(fStyle, 'minHeight', undefined),
        maxWidth: defaultPropSize(fStyle, 'maxWidth', layout.width),
        maxHeight: defaultPropSize(fStyle, 'maxHeight', layout.height),
        resizeMode: props.resizeMode,
        padding: _.get(fStyle, 'padding', undefined)
    });
    const style = useCalculatedStyle(data, config);

    return (
        <>
            <View
                style={StyleSheet.absoluteFill}
                onLayout={onLayout}
            />
            <Animated.View
                style={[styles.container, { opacity }]}
            >
                <RNMathView
                    {...props}
                    svg={data.svg}
                    style={[style, props.style]}
                    ref={ref}
                />
            </Animated.View>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row'
    }
})

const MathViewWrapper = forwardRef(MathView);

MathViewWrapper.defaultProps = MathView.defaultProps = {
    resizeMode: 'center',
    scaleToFit: false,
    config: {}
} as MathViewProps;

MathViewWrapper.Constants = Constants;
MathViewWrapper.getPreserveAspectRatio = (alignment: string, scale: string) => `${alignment} ${scale}`;

export default MathViewWrapper;