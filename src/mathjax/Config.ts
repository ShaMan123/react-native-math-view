import { AllPackages } from 'mathjax-full/js/input/tex/AllPackages';

/**
 * options config: https://github.com/mathjax/MathJax-demos-node/blob/master/direct/tex2svg
 * input config: http://docs.mathjax.org/en/latest/options/input/tex.html
 * output config: http://docs.mathjax.org/en/latest/options/output/svg.html
 */
export interface MathToSVGConfig {
	/** 
	 *  process as inline math, equivalent to 'display' prop
	 *  default: true
	 *  */
	inline: boolean,

	/**
	 * align the math in the container
	 * see output config: http://docs.mathjax.org/en/latest/options/output/svg.html
	 */
	displayAlign: 'auto' | 'center' | 'left' | 'right'

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
	  * see input config: http://docs.mathjax.org/en/latest/options/input/tex.html
	  * */
	packages: string[],

	/**
	 * tex macros
	 * http://docs.mathjax.org/en/latest/input/tex/extensions/configmacros.html#tex-configmacros-options
	 */
	macros: {
		[cmd: string]: string | any[]
	},

	/**
	 * tex environments
	 * http://docs.mathjax.org/en/latest/input/tex/extensions/configmacros.html#tex-configmacros-options
	 */
	environments: {
		[env: string]: any[]
	},

	/**
	 * output the required CSS rather than the SVG itself
	 * default: false 
	 * won't be used in react-native context
	 * */
	//css: boolean,

	/**
	 * whether to use a local font cache or not
	 * default: true
	 * see output config: http://docs.mathjax.org/en/latest/options/output/svg.html
	 * */
	fontCache: boolean,

	/**
	 * https://docs.mathjax.org/en/latest/options/accessibility.html#semantic-enrich-options
	 * */
	enrichSpeech: 'none' | 'shallow' | 'deep',

	/**
	 * see input config: http://docs.mathjax.org/en/latest/options/input/tex.html
	 */
	inlineMath: string[][],

	/**
	 * see input config: http://docs.mathjax.org/en/latest/options/input/tex.html
	 */
	displayMath: string[][]
}

export const mathToSVGDefaultConfig = {
	inline: true,
	displayAlign: 'auto',
	em: 16,
	ex: 8,
	width: 80 * 16,
	packages: AllPackages,
	macros: {},
	environments: {},
	//css: false,
	fontCache: true,
	enrichSpeech: 'deep',
	inlineMath: [['$', '$'], ['\\(', '\\)']],
	displayMath: [['$$', '$$'], ['\[', '\]'], ['\\text{', '}']]
} as MathToSVGConfig;