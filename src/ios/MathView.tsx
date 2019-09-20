'use strict';
import * as React from 'react';
import { UIManager, requireNativeComponent, NativeModules } from 'react-native';

const nativeViewName = 'RNMathView';
const RNMathView = requireNativeComponent(nativeViewName);
const MathViewManager = NativeModules.RNMathViewManager || {};
export const { Constants } = UIManager.getViewManagerConfig ? UIManager.getViewManagerConfig(nativeViewName) : UIManager[nativeViewName];

export default function MathView(props: MathViewProps) {
    return (
        <RNMathView
            {...this.props}
            math={this.props.source.math}
        />
    );
}