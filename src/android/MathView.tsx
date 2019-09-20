'use strict';

import * as _ from 'lodash';
import React, { useCallback, useMemo, useRef, useState, forwardRef } from 'react';
import { Dimensions, NativeModules, requireNativeComponent, StyleSheet, UIManager, View, ViewProps, LayoutChangeEvent } from 'react-native';
import { TeXToSVG, MathProviderResponse } from '../MathProvider';

const nativeViewName = 'RNSVGMathView';
const RNMathView = requireNativeComponent(nativeViewName);
/*
const RNMathView = requireNativeComponent(nativeViewName, MathView, {
    nativeOnly: {
        nativeID: true
    }
});
*/
const MathViewManager = NativeModules.RNMathViewManager || {};
export const { Constants } = UIManager.getViewManagerConfig ? UIManager.getViewManagerConfig(nativeViewName) : UIManager[nativeViewName];

const minDim = 35;
const padding = 10;

export type ResizeMode = 'center' | 'cover' | 'contain' | 'stretch';

export interface MathViewProps extends ViewProps {
    /**
     * Android: passing `{ svg: string }` means you have to handle styling/layout yourself
     * iOS: pass `{ math: string }`
     * */

    //source: { svg: string } | { math: string },

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
     * @default 'cover'
     * */
    resizeMode?: ResizeMode
}

export interface StyleLayoutParams {
    maxWidth: number,
    maxHeight?: number,

    /**
     * defaults to 'center' */
    resizeMode?: ResizeMode
}

async function getInnerStyle(math: string, layoutParams: StyleLayoutParams) {
    return getInnerStyleSync(TeXToSVG(math), layoutParams);
}

function getInnerStyleSync(layoutData: MathProviderResponse, { maxWidth, maxHeight, resizeMode }: StyleLayoutParams) {
    const contain = resizeMode === 'contain';
    const cover = resizeMode === 'cover';
    const stretch = resizeMode === 'stretch';
    const pow = contain ? -1 : 1;
    const minMax = contain || stretch ? Math.min : Math.max;
    const aWidth = stretch ? maxWidth : _.get(layoutData, 'apprxWidth', 0);
    let aHeight = _.get(layoutData, 'apprxHeight', 0);
    aHeight = stretch ? _.defaultTo(maxHeight, aHeight) : aHeight;
    const window = Dimensions.get('window');
    const scaleWidth = Math.min(Math.pow(window.width / (maxWidth - padding * 2), pow), 1);
    const scaleHeight = Math.min(Math.min(minDim / aHeight), 1);
    const scale = cover ? 1 : minMax(scaleWidth, scaleHeight);

    const width = aWidth * scale;
    const height = aHeight * scale;

    return {
        minWidth: minDim,
        minHeight: Math.max(height, minDim),
        flexBasis: Math.max(width, minDim),
        maxWidth: cover ? width : maxWidth - padding * 2,
        display: 'flex',
        elevation: 5,
        flexDirection: 'row'
    };
}

function MathView(props: MathViewProps, ref: any) {
    if (!props.math) return null;
    const [layout, setLayout] = useState(() => {
        const { width, height } = Dimensions.get('window');
        return { width, height };
    })
    //const ref = useRef();
    const setStyle = useCallback((w: number, h: number) => {
        //this.maxWidth = w;
        //this.maxHeight = h;
        ref.current && ref.current.setNativeProps({ style: [this.innerStyle, this.props.style] });
    }, [])
    const onLayout = useCallback((e: LayoutChangeEvent) => {
        if (props.scaleToFit) setLayout({ width: e.nativeEvent.layout.width, height: e.nativeEvent.layout.height}) //this.setStyle(e.nativeEvent.layout.width, e.nativeEvent.layout.height);
    }, [props.scaleToFit, setLayout])

    const data = useMemo(() => TeXToSVG(props.math), [props.math]);
    const innerStyle = useMemo(() => getInnerStyleSync(data, { maxWidth: layout.width, maxHeight: layout.height, resizeMode: props.resizeMode }), [data, layout, props.resizeMode]);
    
    return (
        <>
            <View
                style={StyleSheet.absoluteFill}
                onLayout={onLayout}
            />
            <RNMathView
                {...props}
                svg={data.svg}
                style={[innerStyle, props.style]}
                ref={ref}
            />
        </>
    );
}

const styles = StyleSheet.create({
    base: {
        flex: 1,
        minHeight: minDim
    }
});

const MathViewWrapper = forwardRef(MathView);

MathViewWrapper.defaultProps = MathView.defaultProps = {
    resizeMode: 'center',
    scaleToFit: false,
    style: styles.base
} as MathViewProps;

MathViewWrapper.Constants = Constants;
MathViewWrapper.getPreserveAspectRatio = (alignment: string, scale: string) => `${alignment} ${scale}`;
MathViewWrapper.getInnerStyle = getInnerStyle;
MathViewWrapper.getInnerStyleSync = getInnerStyleSync;

export default MathViewWrapper;