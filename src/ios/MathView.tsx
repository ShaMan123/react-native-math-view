'use strict';
import { MathViewProps } from 'common';
import * as React from 'react';
import { NativeModules, requireNativeComponent, UIManager, ViewProps } from 'react-native';

const nativeViewName = 'RNMathView';
const RNMathView = requireNativeComponent(nativeViewName);
const MathViewManager = NativeModules.RNMathViewManager || {};
export const { Constants } = UIManager.getViewManagerConfig(nativeViewName) || {};

const MathView = React.forwardRef((props: MathViewProps, ref: any) => {
    return (
        <RNMathView
            {...props}
            ref={ref}
        />
    );
});

export default MathView;