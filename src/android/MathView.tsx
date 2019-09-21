'use strict';

import * as _ from 'lodash';
import React, { useCallback, useMemo, useRef, useState, forwardRef, useEffect } from 'react';
import { Dimensions, NativeModules, requireNativeComponent, StyleSheet, UIManager, View, ViewProps, LayoutChangeEvent } from 'react-native';
import { TeXToSVG, MathProviderResponse } from '../MathProvider';
import defaultConfig, { ResizeMode, TeX2SVGConfig } from '../Config';
import { useCalculatedStyle } from '../CalculatedStyle';

const nativeViewName = 'RNSVGMathView';
const RNMathView = requireNativeComponent(nativeViewName);
const MathViewManager = NativeModules.RNMathViewManager || {};
export const { Constants } = UIManager.getViewManagerConfig ? UIManager.getViewManagerConfig(nativeViewName) : UIManager[nativeViewName];


export interface MathViewProps extends ViewProps {
    math: string,

    /**
     * set text color
     * can be set via `setNativeProps`
     * */
    color?: string,

    /**
     * set to `true` to fit the view to it's parent
     * defaults to `false`
     * */
    scaleToFit?: boolean,

    /**
     * defaults to 'center'
     * */
    resizeMode?: ResizeMode,

    config?: TeX2SVGConfig
}

function MathView(props: MathViewProps, ref: any) {
    if (!props.math) return null;

    const [layout, setLayout] = useState(() => {
        const { width, height } = Dimensions.get('window');
        return { width, height, initialized: false };
    });
    const onLayout = useCallback((e: LayoutChangeEvent) => {
        if (props.scaleToFit && !layout.initialized) {
            setLayout({
                width: e.nativeEvent.layout.width,
                height: e.nativeEvent.layout.height,
                initialized: true
            });
        }
    }, [props.scaleToFit, layout, setLayout]);
    
    const data = useMemo(() => TeXToSVG(props.math), [props.math]);
    
    const config = _.assign({}, props.config, {
        maxWidth: layout.width,
        maxHeight: layout.height,
        resizeMode: props.resizeMode
    });
    const style = useCalculatedStyle(data, config);

    return (
        <>
            <View
                style={StyleSheet.absoluteFill}
                onLayout={onLayout}
            />
            <RNMathView
                {...props}
                svg={data.svg}
                style={[style, props.style]}
                ref={ref}
            />
        </>
    );
}

const MathViewWrapper = forwardRef(MathView);

MathViewWrapper.defaultProps = MathView.defaultProps = {
    resizeMode: 'center',
    scaleToFit: false,
    config: {}
} as MathViewProps;

MathViewWrapper.Constants = Constants;
MathViewWrapper.getPreserveAspectRatio = (alignment: string, scale: string) => `${alignment} ${scale}`;

export default MathViewWrapper;