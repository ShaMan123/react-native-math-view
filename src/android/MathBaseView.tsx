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
export const mathjaxGlobal = MathjaxFactory();

/**
 * *****    CAUTION: use at own risk    ****
 * use only for custom use cases
 * MUST pass a valid `svg` prop
 * 
 * @param props
 * @param ref
 */
const MathBaseView = forwardRef((props: MathViewBaseProps, ref: Ref<any>) => {
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
            key={key}
        />
    );
});

MathBaseView.defaultProps = {
    resizeMode: 'contain',
    config: {}
} as Partial<MathViewBaseProps>;

export { MathBaseView as default };

