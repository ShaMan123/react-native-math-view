import { AllPackages } from 'mathjax-full/js/input/tex/AllPackages';

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
	 * won't be used in react-native context
	 * */
	//css: boolean,

	/**
	 * whether to use a local font cache or not
	 * default: true 
	 * */
	fontCache: boolean,

	/**
	 * https://docs.mathjax.org/en/latest/options/accessibility.html#semantic-enrich-options
	 * */
	enrichSpeech: 'none' | 'shallow' | 'deep',

	/**
	 * https://docs.mathjax.org/en/v1.0/options/tex2jax.html#configure-tex2jax
	 */
	inlineMath: string[][],
	displayMath: string[][]
}

export const mathToSVGDefaultConfig = {
	inline: true,
	em: 16,
	ex: 8,
	width: 80 * 16,
	packages: AllPackages,
	//css: false,
	fontCache: true,
	enrichSpeech: 'deep',
	inlineMath: [['$', '$'], ['\\(', '\\)']],
	displayMath: [['$$', '$$'], ['\[', '\]'], ['\\text{', '}']]
} as MathToSVGConfig;