import { AllPackages } from 'mathjax-full/js/input/tex/AllPackages';

export type ResizeMode = 'center' | 'cover' | 'contain' | 'stretch';

export interface MathToSVGConfig {
    /** 
     *  process as inline math
     *  default: true
     *  */
    inline: boolean,

    /**
     * em-size in pixels
     * default: 16 
     * */
    em: number,

    /**
     * ex-size in pixels
     * default: 8 
     * */
    ex: number,

    /**
     * width of container in pixels
     * default: 80 * 16
     * */
    width: number,

   /**
     * the packages to use, e.g. "base, ams"
     * default: AllPackages
     * */
    packages: string[],

    /**
     * output the required CSS rather than the SVG itself
     * default: false 
     * */
    css: boolean,

    /**
     * whether to use a local font cache or not
     * default: true 
     * */
    fontCache: boolean,
}

export interface StylingConfig {
    /**
     * minimum width/height of view
     * default: 35 
     * */
    minSize: number,

    /**
     * view padding
     * default: 10 
     * */
    padding: number,

    /**
     * default: 'center' 
     * */
    resizeMode: ResizeMode
}

export const mathToSVGDefaultConfig = {
    inline: true,
    em: 16,
    ex: 8,
    width: 80 * 16,
    packages: AllPackages,
    css: false,
    fontCache: true
} as MathToSVGConfig;

export const stylingDefaultConfig = {
    minSize: 35,
    padding: 10,
    resizeMode: 'center'
} as StylingConfig;