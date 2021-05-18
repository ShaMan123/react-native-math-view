import _ from "lodash";
import React, { useEffect, useMemo, useState } from "react";
import { StyleProp, StyleSheet, Text, TextStyle, View, ViewProps, ViewStyle } from "react-native";
import MathjaxFactory, { MathToSVGConfig } from "./mathjax";
import MathjaxAdaptor from "./mathjax/MathjaxAdaptor";

export type ResizeMode = 'cover' | 'contain';

export interface MathViewProps extends ViewProps {
    /**
     * see the list of LaTeX commands:
     * http://docs.mathjax.org/en/latest/input/tex/macros/index.html
     * */
    math: string,

    /**
     * set text color
     * can be set via `setNativeProps` or passed via `style`
     * */
    color?: string,
    style?: StyleProp<ViewStyle & Pick<TextStyle, 'color'>>

    /**
     * defaults to 'center'
     * */
    resizeMode?: ResizeMode,

    /**MathJax config object */
    config?: Partial<MathToSVGConfig>,

    /**Fallback component that will be rendered if a parsing error occurs */
    renderError?: React.FC<MathViewErrorProps> | React.ReactElement<MathViewErrorProps>

    onError?: (error: Error) => any

    /**Verbose option for debugging, disabled in production */
    debug?: boolean
}

export type HookType = 'svg' | 'svg-xml';

export type ReturnValueByHook<T extends HookType> = T extends 'svg-xml' ?
    { xml: string; width: number; height: number; } :
    T extends 'svg' ?
    string :
    never;

export type NormalizedReturnValueByHook<T extends HookType> = (T extends 'svg-xml' ?
    { xml: string; width: number; height: number; } :
    T extends 'svg' ?
    { svg: string } :
    never) | { error: Error };

export type Func<T extends HookType> = (((math: string) => ReturnValueByHook<T>) & _.MemoizedFunction);

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
            /*
            return (
                <Component
                    {...props}
                    {...resultProps}
                    ref={ref}
                />
            );
            */
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


export enum MathError {
    parsing = "MATH_ERROR/PARSING"
}

export interface MathViewErrorProps extends MathViewProps {
    error: Error
}

export const ErrorComponent = (props: MathViewErrorProps) => <View style={[props.style, styles.multilineText]}>
    <Text style={props.style}>{props.math}</Text>
    <Text style={[props.style, styles.error]}>{props.error}</Text>
</View>;

const MathErrorBoundary = React.memo((props: MathViewProps & { error: Error }) => {
    const { error, renderError: Fallback, onError } = props;
    if (_.every(_.values(MathError), enumo => enumo !== error.name)) throw error;
    useEffect(() => {
        if (onError) {
            onError(error);
        } else if (!Fallback && __DEV__) {
            console.warn('react-native-math-view: Parsing Error', error);
        }
    }, [error]);
    return typeof Fallback === 'function' ?
        <Fallback
            {...props}
        /> :
        React.isValidElement(Fallback) ?
            React.cloneElement(Fallback, { error }) :
            null;
});

export function useDebug(debug: boolean | undefined, ...values: any[]) {
    useEffect(() => {
        __DEV__ && debug && console.log('react-native-math-view', ...values);
    }, [...values, debug]);
}

export const getPreserveAspectRatio = (alignment: string, scale: string) => `${alignment} ${scale}`;

export const styles = StyleSheet.create({
    container: {
        //flexDirection: 'row',
        display: 'flex',
        minHeight: 35
    },
    contain: {
        maxWidth: '100%',
        maxHeight: '100%'
    },
    error: {
        fontWeight: 'bold'
    },
    multilineText: {
        display: 'flex',
        flexDirection: 'column'
    }
});