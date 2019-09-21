import * as _ from 'lodash';
import { useMemo } from 'react';
import { Dimensions } from 'react-native';
import defaultConfig, { ResizeMode, TeX2SVGConfig } from './Config';
import { TeXToSVG, MathProviderResponse } from './MathProvider';

export interface CalculatedStyleConfig extends TeX2SVGConfig {
    maxWidth: number,
    maxHeight: number,
}

export function useCalculatedStyle(mathOrResponse: string | MathProviderResponse, config: Partial<CalculatedStyleConfig> = {}) {
    const window = Dimensions.get('window');
    return useMemo(() => {
        _.defaultsDeep(config, defaultConfig, { maxWidth: window.width });
        const mathProviderResponse = _.isString(mathOrResponse) ? TeXToSVG(mathOrResponse, config) : mathOrResponse;
        const { maxWidth, maxHeight, resizeMode } = config;
        const contain = resizeMode === 'contain';
        const cover = resizeMode === 'cover';
        const stretch = resizeMode === 'stretch';
        const pow = contain ? -1 : 1;
        const minMax = contain || stretch ? Math.min : Math.max;
        const aWidth = stretch ? maxWidth : _.get(mathProviderResponse, 'width', 0);
        let aHeight = _.get(mathProviderResponse, 'height', 0);
        aHeight = stretch ? _.defaultTo(maxHeight, aHeight) : aHeight;

        const scaleWidth = Math.min(Math.pow(window.width / (maxWidth - config.padding * 2), pow), 1);
        const scaleHeight = Math.min(Math.min(config.minSize / aHeight), 1);
        const scale = cover ? 1 : minMax(scaleWidth, scaleHeight);

        const width = aWidth * scale;
        const height = aHeight * scale;

        return {
            minWidth: config.minSize,
            minHeight: Math.max(height, config.minSize),
            flexBasis: Math.max(width, config.minSize),
            maxWidth: cover ? width : maxWidth - config.padding * 2,
            display: 'flex',
            elevation: 5,
            flexDirection: 'row'
        };
    }, [mathOrResponse, config, window]);
}

