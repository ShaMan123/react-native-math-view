'use strict';

import _ from 'lodash';
import React, { forwardRef, Ref, useMemo } from 'react';
import { NativeModules, requireNativeComponent, UIManager } from 'react-native';
import { MathViewProps, styles } from '../common';
import MathjaxFactory from '../mathjax';

const nativeViewName = 'RNMathView';
const RNMathView = requireNativeComponent(nativeViewName);
const MathViewManager = NativeModules.RNMathViewManager || {};

export type TConstants = { "PreserveAspectRatio": { "Alignment": { "none": "none", "xMaxYMax": "xMaxYMax", "xMaxYMid": "xMaxYMid", "xMaxYMin": "xMaxYMin", "xMidYMax": "xMidYMax", "xMidYMid": "xMidYMid", "xMidYMin": "xMidYMin", "xMinYMax": "xMinYMax", "xMinYMid": "xMinYMid", "xMinYMin": "xMinYMin" }, "BOTTOM": "xMidYMax meet", "END": "xMaxYMax meet", "FULLSCREEN": "xMidYMid slice", "FULLSCREEN_START": "xMinYMin slice", "LETTERBOX": "xMidYMid meet", "START": "xMinYMin meet", "STRETCH": "none null", "Scale": { "meet": "meet", "slice": "slice" }, "TOP": "xMidYMin meet", "UNSCALED": "null null" }, "ScaleType": { "CENTER": "CENTER", "CENTER_CROP": "CENTER_CROP", "CENTER_INSIDE": "CENTER_INSIDE", "FIT_CENTER": "FIT_CENTER", "FIT_END": "FIT_END", "FIT_START": "FIT_START", "FIT_XY": "FIT_XY", "MATRIX": "MATRIX" } };
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
    preserveAspectRatio: "xMinYMid meet",
    config: {}
} as Partial<MathViewBaseProps>;

export { MathBaseView as default };
