import React, { useEffect, useMemo, useState } from "react";
import { Func, HookType, MathViewProps, NormalizedReturnValueByHook, ReturnValueByHook } from "./common";
import { MathErrorBoundary } from "./Error";
import MathjaxAdaptor from "./mathjax/MathjaxAdaptor";
import MathjaxFactory from "./mathjax/MathjaxFactory";

export function useDebug(debug: boolean | undefined, ...values: any[]) {
    useEffect(() => {
        __DEV__ && debug && console.log('react-native-math-view', ...values);
    }, [...values, debug]);
}

function useMathjax<T extends HookType>(type: T, props: MathViewProps) {
    const { math, config } = props;
    const mathjax = useMemo(() => MathjaxFactory(config), [config]);
    const func = useMemo(() => {
        if (!math) return () => '';
        switch (type) {
            case 'svg':
                return mathjax.toSVG;
            case 'svg-xml':
                return mathjax.toSVGXMLProps;
            default:
                throw new Error('react-native-math-view: unknown type ' + type);
        }
    }, [math, mathjax, type]);
    return [mathjax, func] as [MathjaxAdaptor, Func<T>];
}

/**
 * Async Rendering
 * better performance
 * uses memoize to improve first draw:
 * if `math` prop didn't mount yet (no memoized value) revert to async rendering, otherwise use memoized value (prevents an unnecessary render and wait)
 */
export function useAsyncParser<T extends HookType>(type: T, props: MathViewProps) {
    const { math } = props;
    const [mathjax, func] = useMathjax(type, props);
    const [result, setResult] = useState<NormalizedReturnValueByHook<T> | undefined>(() => {
        const value = func.cache.has(math) ? func.cache.get(math) : undefined;
        return value ? type === 'svg' ? { svg: value } : value : undefined;
    });
    useEffect(() => {
        try {
            const res = func(math);
            setResult((type === 'svg' ? { svg: res as string } : res) as NormalizedReturnValueByHook<T>);
        } catch (error) {
            setResult({ error });
        }
    }, [type, math, func]);
    return result;
}

/**
 * Sync Rendering
 * poor performance in first draw, causes js thread to hold for 2-3 seconds on initial mounts
 */
export function useSyncParser(type: HookType, props: MathViewProps) {
    const { math, config } = props;
    const [mathjax, func] = useMathjax(type, props);
    return useMemo(() => {
        try {
            const result = func(math);
            return type === 'svg' ? { svg: result } : result;
        } catch (error) {
            return { error };
        }
    }, [type, math, func]) as { svg: string } | ReturnValueByHook<'svg-xml'> | { error: Error };
}

export function mathViewAsyncRenderer<T extends MathViewProps, R extends any>(type: HookType, render: React.ForwardRefRenderFunction<R, T>) {
    return React.forwardRef((props: MathViewProps, ref: React.Ref<R>) => {
        const resultProps = useAsyncParser(type, props);
        useDebug(props.debug, resultProps);
        if (resultProps?.error) {
            return <MathErrorBoundary {...props} {...resultProps as { error: Error }} />;
        } else if (resultProps) {
            return render({ ...props, ...resultProps }, ref);
        } else {
            //  noop
            return null;
        }
    });
}

export function mathViewSyncRenderer<T extends MathViewProps, R extends any>(type: HookType, render: React.ForwardRefRenderFunction<R, T>) {
    return React.forwardRef((props: MathViewProps, ref: React.Ref<R>) => {
        const resultProps = useSyncParser(type, props);
        return resultProps.error ?
            <MathErrorBoundary {...props} {...resultProps as { error: Error }} /> :
            render({ ...props, ...resultProps }, ref);
    });
}

export function mathViewRender<T extends MathViewProps, R extends any>(type: HookType, async: boolean, render: React.ForwardRefRenderFunction<R, T>) {
    return async ? mathViewAsyncRenderer(type, render) : mathViewSyncRenderer(type, render)
}
