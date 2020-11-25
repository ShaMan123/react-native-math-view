'use strict';

import _ from 'lodash';
import React, { forwardRef, Ref, useEffect, useMemo, useState } from 'react';
import { NativeModules, requireNativeComponent, UIManager } from 'react-native';
import { ErrorComponent, MathViewProps, styles } from '../common';
import MathjaxFactory from '../mathjax';

const nativeViewName = 'RNMathView';
const RNMathView = requireNativeComponent(nativeViewName);
const MathViewManager = NativeModules.RNMathViewManager || {};
//console.log(UIManager.getViewManagerConfig('getConstants')().RNMathView)
export const { Constants } = UIManager.getViewManagerConfig(nativeViewName) || {};

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
    //const key = useMemo(() => _.uniqueId('MathView'), [props.svg]);

    return (
        <RNMathView
            {...props}
            style={[styles.container, props.resizeMode === 'contain' && styles.contain, props.style]}
            ref={ref}
        //key={key}
        />
    );
}

const ControlledMathView = forwardRef(MathBaseView);

/**
 *  //  Async Rendering
    //  -----------------------------------------------------------------------------------------------------------------------------------------------
    //  better performance
    //  uses memoize to improve first draw:
    //  if `math` prop didn't mount yet (no memoized value) revert to async rendering, otherwise use memoized value (prevents an unnecessary render and wait)
 */
export function useLatexToSVGAsync(props: MathViewProps) {
    const { math, config } = props;
    const mathjax = useMemo(() => MathjaxFactory(config), [config]);
    const [svg, setSVG] = useState(mathjax.toSVG.cache.has(math) ? mathjax.toSVG.cache.get(math) : undefined);
    useEffect(() => {
        setSVG(mathjax.toSVG(math));
    }, [math, mathjax]);
    return svg;
}

/**
 *  //  Sync Rendering
    //  -----------------------------------------------------------------------------------------------------------------------------------------------
    //  poor performance in first draw, causes js thread to hold for 2-3 seconds on initial mounts
    //  uncomment this line and comment async rendering section to test sync rendering
 */
export function useLatexToSVGSync(props: MathViewProps) {
    const { math, config } = props;
    const mathjax = useMemo(() => MathjaxFactory(config), [config]);
    return useMemo(() => mathjax.toSVG(math), [math, mathjax]);
}

/**
 * uses async rendering for better performance in combination with memoization
 * read more in source files
 * @param props
 * @param ref
 */
function MathView(props: MathViewProps, ref: any) {
    if (!props.math) return null;
    try {
        const svg = MathjaxFactory(props.config).toSVG(props.math)//useLatexToSVGAsync(props);
        return (
            <ControlledMathView
                {...props}
                svg={svg}
                ref={ref}
            />
        );
    } catch (error) {
        const { renderError: Fallback } = props;
        return typeof Fallback === 'function' ?
            <Fallback
                error={`${error}`}    //escape \
                {...props}
            /> :
            React.isValidElement(Fallback) ?
                Fallback :
                null;
    }
}

const MathViewWrapper = forwardRef(MathView);

ControlledMathView.defaultProps = MathBaseView.defaultProps = {
    resizeMode: 'contain',
    config: {}
} as Partial<MathViewBaseProps>;

MathViewWrapper.defaultProps = MathView.defaultProps = {
    resizeMode: 'contain',
    config: {},
    renderError: ErrorComponent
} as Partial<MathViewProps>;

//@ts-ignore
MathViewWrapper.Constants = ControlledMathView.Constants = Constants;
//@ts-ignore
MathViewWrapper.getPreserveAspectRatio = ControlledMathView.getPreserveAspectRatio = (alignment: string, scale: string) => `${alignment} ${scale}`;

export { MathViewWrapper as default, ControlledMathView };

