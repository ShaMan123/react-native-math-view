import * as _ from 'lodash';
import { useMemo } from 'react';
import { Dimensions, ViewStyle } from 'react-native';
import { ResizeMode, MathToSVGConfig, StylingConfig, mathToSVGDefaultConfig, stylingDefaultConfig } from './Config';
import { mathToSVG, MathProviderResponse } from './MathProvider';

export type CalculatedStyleConfig = MathToSVGConfig & StylingConfig & {
    minWidth: number,
    minHeight: number,
    maxWidth: number,
    maxHeight: number,
    windowWidth: number,
    windowHeight: number,
}

export function calculateStyle(mathOrResponse: string | MathProviderResponse, config: Partial<CalculatedStyleConfig> = {}): ViewStyle {
    const __config = _.defaultsDeep(config, mathToSVGDefaultConfig, stylingDefaultConfig, {
        maxWidth: config.windowWidth,
        minWidth: stylingDefaultConfig.minSize,
        minHeight: stylingDefaultConfig.minSize
    }) as CalculatedStyleConfig;

    const mathProviderResponse = _.isString(mathOrResponse) ? mathToSVG(mathOrResponse, __config) : mathOrResponse;

    const { maxWidth, maxHeight, resizeMode } = __config;

    const contain = resizeMode === 'contain';
    const cover = resizeMode === 'cover';
    const stretch = resizeMode === 'stretch';
    const pow = contain ? -1 : 1;
    const minMax = contain || stretch ? Math.min : Math.max;
    const aWidth = stretch ? maxWidth : _.get(mathProviderResponse, 'width', 0);
    let aHeight = _.get(mathProviderResponse, 'height', 0);
    aHeight = stretch ? _.defaultTo(maxHeight, aHeight) : aHeight;

    const scaleWidth = Math.min(Math.pow(__config.windowWidth / (maxWidth - __config.padding * 2), pow), 1);
    const scaleHeight = Math.min(Math.min(__config.minHeight / aHeight), 1);
    const scale = cover ? 1 : minMax(scaleWidth, scaleHeight);

    const width = aWidth * scale;
    const height = aHeight * scale;

    return {
        minWidth: __config.minWidth,
        minHeight: Math.max(height, __config.minHeight),
        flexBasis: Math.max(width, __config.minWidth),
        maxWidth: cover ? width : maxWidth - __config.padding * 2,
        display: 'flex',
        elevation: 5,
        flexDirection: 'row'
    };
}

export function useCalculatedStyle(mathOrResponse: string | MathProviderResponse, config: Partial<CalculatedStyleConfig> = {}) {
    return useMemo(() => calculateStyle(mathOrResponse, config), [mathOrResponse, config]);
}

