'use strict';

import * as _ from 'lodash';
import React, { forwardRef, useEffect, useMemo, useState, Ref } from 'react';
import { NativeModules, requireNativeComponent, UIManager, ViewProps } from 'react-native';
import { styles } from '../common';
import MathjaxFactory, { MathToSVGConfig } from '../mathjax/index';

const nativeViewName = 'RNMathView';
const RNMathView = requireNativeComponent(nativeViewName);
const MathViewManager = NativeModules.RNMathViewManager || {};
//console.log(UIManager.getViewManagerConfig('getConstants')().RNMathView)
export const { Constants } = UIManager.getViewManagerConfig ? UIManager.getViewManagerConfig(nativeViewName) : (UIManager[nativeViewName] || {});

export type ResizeMode = 'cover' | 'contain';

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

    config?: Partial<MathToSVGConfig>
}

export interface MathViewBaseProps extends MathViewProps {
    svg: string
}

/** call MathjaxFactory to create and cache an instance of @class {MathjaxAccessor} for future use */
const mathjaxGlobal = MathjaxFactory();

/**
 * *****    CAUTION: use at own risk    ****
 * use only for custom use cases
 * A pass props rendering function
 * MUST pass a valid `svg` prop
 * 
 * @param props
 * @param ref
 */
function MathBaseView(props: MathViewBaseProps, ref: Ref<any>) {
    //  Layout Task Manager
    //  -----------------------------------------------------------------------------------------------------------------------------------------------
    //  used to remount RNMathView in order to recompute layout properly 
    //  occurs after props.math changes svg
    const key = useMemo(() => _.uniqueId('MathView'), [props.svg]);

    return (
        <RNMathView
            {...props}
            style={[styles.container, props.resizeMode === 'contain' && styles.contain, props.style]}
            ref={ref}
            hardwareAccelerated
            key={key}
        />
    );
}

const ControlledMathView = forwardRef(MathBaseView);

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
    const [svg, setSVG] = useState(mathjax.toSVG.cache.has(props.math) ? mathjax.toSVG.cache.get(props.math) : undefined);
    useEffect(() => {
        setSVG(mathjax.toSVG(props.math));
    }, [props.math, mathjax]);

    //  -----------------------------------------------------------------------------------------------------------------------------------------------

    //  Sync Rendering  
    //  -----------------------------------------------------------------------------------------------------------------------------------------------
    //  poor performance in first draw, causes js thread to hold for 2-3 seconds on initial mounts
    //  uncomment this line and comment async rendering section to test sync rendering
    //const svg = useMemo(() => mathjax.toSVG(props.math), [props.math, mathjax]);

    return (
        <ControlledMathView
            {...props}
            svg={svg}
            ref={ref}
        />
    );
}

const MathViewWrapper = forwardRef(MathView);

ControlledMathView.defaultProps = MathBaseView.defaultProps = {
    resizeMode: 'contain',
    config: {}
} as Partial<MathViewBaseProps>;

MathViewWrapper.defaultProps = MathView.defaultProps = {
    resizeMode: 'contain',
    config: {}
} as Partial<MathViewProps>;

//@ts-ignore
MathViewWrapper.Constants = ControlledMathView.Constants = Constants;
//@ts-ignore
MathViewWrapper.getPreserveAspectRatio = ControlledMathView.getPreserveAspectRatio = (alignment: string, scale: string) => `${alignment} ${scale}`;

export { MathViewWrapper as default, ControlledMathView };
