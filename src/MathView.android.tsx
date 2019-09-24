'use strict';

import * as _ from 'lodash';
import React, { forwardRef, useMemo } from 'react';
import { Animated, NativeModules, requireNativeComponent, StyleSheet, UIManager, ViewProps, ViewStyle } from 'react-native';
import { MathToSVGConfig, ResizeMode } from './Config';
import { mathToSVG } from './MathProvider';

const nativeViewName = 'RNMathView';
const RNMathView = requireNativeComponent(nativeViewName);
const MathViewManager = NativeModules.RNMathViewManager || {};
export const { Constants } = UIManager.getViewManagerConfig ? UIManager.getViewManagerConfig(nativeViewName) : UIManager[nativeViewName];

const AnimatedMathView = Animated.createAnimatedComponent(RNMathView);

export interface MathViewProps extends ViewProps {
    math: string,

    /**
     * set text color
     * can be set via `setNativeProps` or passed via `style`
     * */
    color?: string,

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

    const svg = useMemo(() => mathToSVG(props.math), [props.math]);
    const key = useMemo(() => _.uniqueId('MathView'), [props.math]);

    return (
        <RNMathView
            {...props}
            svg={svg}
            style={[styles.container, props.resizeMode === 'contain' && styles.contain, props.style]}
            ref={ref}
            hardwareAccelerated
            key={key}
        />
    );
}

const styles = StyleSheet.create({
    container: {
        //flexDirection: 'row',
        display: 'flex',
        minHeight: 35
    },
    contain: {
        maxWidth: '100%',
        maxHeight: '100%'
    }
})

const MathViewWrapper = forwardRef(MathView);

MathViewWrapper.defaultProps = MathView.defaultProps = {
    resizeMode: 'contain',
    config: {}
} as Partial<MathViewProps>;

//@ts-ignore
MathViewWrapper.Constants = Constants;
//@ts-ignore
MathViewWrapper.getPreserveAspectRatio = (alignment: string, scale: string) => `${alignment} ${scale}`;

export default MathViewWrapper;