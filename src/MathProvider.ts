import * as _ from 'lodash';
//@ts-ignore
import { liteAdaptor } from 'mathjax-full/js/adaptors/liteAdaptor';
//@ts-ignore
import { RegisterHTMLHandler } from 'mathjax-full/js/handlers/html';
//@ts-ignore
import { TeX } from 'mathjax-full/js/input/tex';
//@ts-ignore
import { mathjax } from 'mathjax-full/js/mathjax';
//@ts-ignore
import { SVG } from 'mathjax-full/js/output/svg';
import { MathToSVGConfig, mathToSVGDefaultConfig } from './Config';

function parseSize(size: string | number, config: Partial<MathToSVGConfig> = {}) {
    if (typeof size === 'number') return size;
    const unit = size.substr(-2);
    return _.get(config, unit, 1) * parseFloat(size);
}

/**
 * 
 * @param math
 * @param config
 */
function toSVG(math: string, config: Partial<MathToSVGConfig> = {}) {
    const opts = _.defaultsDeep(config, mathToSVGDefaultConfig);
    //
    //  Create DOM adaptor and register it for HTML documents
    //
    const adaptor = liteAdaptor();
    RegisterHTMLHandler(adaptor);

    //
    //  Create input and output jax and a document using them on the content from the HTML file
    //
    const tex = new TeX({ packages: opts.packages });
    const svg = new SVG({ fontCache: (opts.fontCache ? 'local' : 'none') });
    const html = mathjax.document('', { InputJax: tex, OutputJax: svg });

    //
    //  Typeset the math from the command line
    //
    
    const node = html.convert(math, {
        display: !opts.inline,
        em: opts.em,
        ex: opts.ex,
        containerWidth: opts.width
    });

    //
    //  If the --css option was specified, output the CSS,
    //  Otherwise, typeset the math and output the HTML
    //

    /*
     * handled in native (android)
     * 
    const svgNode = adaptor.firstChild(node);
    const width = parseSize(adaptor.getAttribute(svgNode, 'width'), config);
    const height = parseSize(adaptor.getAttribute(svgNode, 'height'), config);
    */

    const stringSVG = _.replace(opts.css ? adaptor.textContent(svg.styleSheet(html)) : adaptor.innerHTML(node), /xlink:xlink/g, 'xlink');

    return stringSVG;
}

export const mathToSVG = _.memoize(toSVG);