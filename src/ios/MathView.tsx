'use strict';
import * as React from 'react';
import { NativeModules, requireNativeComponent, UIManager, ViewProps } from 'react-native';

const nativeViewName = 'RNMathView';
const RNMathView = requireNativeComponent(nativeViewName);
const MathViewManager = NativeModules.RNMathViewManager || {};
export const { Constants } = UIManager.getViewManagerConfig ? UIManager.getViewManagerConfig(nativeViewName) : UIManager[nativeViewName] || {};

export interface MathViewProps extends ViewProps {
    math: string,

    /**
     * set text color
     * can be set via `setNativeProps` or passed via `style`
     * */
    color?: string,
    style?: ViewProps['style'] & { color: any }
}

function MathView(props: MathViewProps, ref: any) {
    return (
        <RNMathView
            {...props}
            ref={ref}
        />
    );
}

export default React.forwardRef(MathView);