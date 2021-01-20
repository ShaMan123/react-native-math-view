'use strict';

import React, { forwardRef, useEffect, useMemo, useState } from 'react';
import { ErrorComponent, mathErrorBoundary, MathViewProps } from '../common';
import MathjaxFactory from '../mathjax';
import MathBaseView, { MathViewBaseProps } from './MathBaseView';

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
    const [error, setError] = useState();
    useEffect(() => {
        try {
            setSVG(mathjax.toSVG(math));
        } catch (error) {
            setError(error);
        }
    }, [math, mathjax]);
    if (error) {
        const err = error;
        setError(undefined);
        throw err;
    }
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
export const MathView = forwardRef((props: MathViewProps, ref: any) => {
    if (!props.math) return null;
    try {
        const svg = useLatexToSVGAsync(props);
        return (
            <MathBaseView
                {...props}
                svg={svg}
                ref={ref}
            />
        );
    } catch (error) {
        return mathErrorBoundary(error, props);
    }
});

MathBaseView.defaultProps = {
    resizeMode: 'contain',
    config: {}
} as Partial<MathViewBaseProps>;

MathView.defaultProps = {
    ...MathBaseView.defaultProps,
    renderError: ErrorComponent
} as Partial<MathViewProps>;

export { MathView as default };

