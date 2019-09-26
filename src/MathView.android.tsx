'use strict';

import * as _ from 'lodash';
import React, { forwardRef, useMemo, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { Animated, NativeModules, requireNativeComponent, StyleSheet, UIManager, ViewProps, ViewStyle } from 'react-native';
import { MathToSVGConfig, ResizeMode, mathToSVGDefaultConfig } from './Config';
import MathjaxFactory, { MathjaxAdaptor } from './MathjaxFactory';

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
    style?: ViewProps['style'] & { color: any }

    /**
     * defaults to 'center'
     * */
    resizeMode?: ResizeMode,

    config?: MathToSVGConfig
}

const mathjaxGlobal = MathjaxFactory();

/**
 * uses async rendering for better performance in combination with memoization
 * read more in source files
 * @param props
 * @param ref
 */
function MathView(props: MathViewProps, ref: any) {
    if (!props.math) return null;
    const mathjax = useMemo(() => MathjaxFactory(props.config), [props.config]);

    //  Async Rendering
    //  -----------------------------------------------------------------------------------------------------------------------------------------------
    //  better performance
    //  uses memoize to improve first draw:
    //  if `math` prop didn't mount yet (no memoized value) revert to async rendering, otherwise use memoized value (prevents an unnecessary render and wait)
    const [svg, setSVG] = useState(mathjax.toSVG.cache.has(props.math) ? mathjax.toSVG.cache.get(props.math): undefined);
    useEffect(() => {
        setSVG(mathjax.toSVG(props.math));
    }, [props.math, mathjax]);

    //  -----------------------------------------------------------------------------------------------------------------------------------------------

    //  Sync Rendering  
    //  -----------------------------------------------------------------------------------------------------------------------------------------------
    //  poor performance in first draw, causes js thread to hold for 2-3 seconds on initial mounts
    //  uncomment this line and comment async rendering section to test sync rendering
    //const svg = useMemo(() => mathjax.toSVG(props.math), [props.math, mathjax]);

    //  Layout Task Manager
    //  -----------------------------------------------------------------------------------------------------------------------------------------------
    //  used to remount RNMathView in order to recompute layout properly 
    //  occurs after props.math changes svg
    const key = useMemo(() => _.uniqueId('MathView'), [svg]);
    
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