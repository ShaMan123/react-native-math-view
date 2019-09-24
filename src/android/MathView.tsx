'use strict';

import * as _ from 'lodash';
import React, { forwardRef, useCallback, useEffect, useMemo, useState } from 'react';
import { Animated, Dimensions, LayoutChangeEvent, NativeModules, requireNativeComponent, ScaledSize, StyleSheet, UIManager, View, ViewProps, ViewStyle } from 'react-native';
import { useCalculatedStyle } from '../CalculatedStyle';
import { MathToSVGConfig, ResizeMode } from '../Config';
import { mathToSVG } from '../MathProvider';

const nativeViewName = 'RNMathView';
const RNMathView = requireNativeComponent(nativeViewName);
const MathViewManager = NativeModules.RNMathViewManager || {};
export const { Constants } = UIManager.getViewManagerConfig ? UIManager.getViewManagerConfig(nativeViewName) : UIManager[nativeViewName];

const AnimatedMathView = Animated.createAnimatedComponent(RNMathView);

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

    const data = useMemo(() => mathToSVG(props.math), [props.math]);

    return (
        <RNMathView
            {...props}
            svg={data.svg}
            style={[styles.container, props.style]}
            ref={ref}
            hardwareAccelerated
        />
    );
}

const styles = StyleSheet.create({
    container: {
        //flexDirection: 'row',
        display: 'flex',
        minHeight: 35
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