import * as _ from 'lodash';
import { liteAdaptor } from 'mathjax-full/js/adaptors/liteAdaptor';
import { RegisterHTMLHandler } from 'mathjax-full/js/handlers/html';
import { TeX } from 'mathjax-full/js/input/tex';
import { mathjax } from 'mathjax-full/js/mathjax';
import { SVG } from 'mathjax-full/js/output/svg';
import { MathToSVGConfig, mathToSVGDefaultConfig } from './Config';

export interface MathProviderResponse {
    math: string,
    svg: string,
    width: number,
    height: number
}

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

    const svgNode = adaptor.firstChild(node);
    const width = parseSize(adaptor.getAttribute(svgNode, 'width'), config);
    const height = parseSize(adaptor.getAttribute(svgNode, 'height'), config);

    const stringSVG = _.replace(opts.css ? adaptor.textContent(svg.styleSheet(html)) : adaptor.innerHTML(node), /xlink:xlink/g, 'xlink');

    return {
        math,
        svg: stringSVG,
        width,
        height
    };
}

export const mathToSVG = _.memoize(toSVG);