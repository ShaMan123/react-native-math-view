import * as _ from 'lodash';
import { liteAdaptor } from 'mathjax-full/js/adaptors/liteAdaptor';
import { RegisterHTMLHandler } from 'mathjax-full/js/handlers/html';
import { TeX } from 'mathjax-full/js/input/tex';
import { AllPackages } from 'mathjax-full/js/input/tex/AllPackages';
import { mathjax } from 'mathjax-full/js/mathjax';
import { SVG } from 'mathjax-full/js/output/svg';
function parseSize(size, config) {
    if (config === void 0) { config = {}; }
    if (typeof size === 'number')
        return size;
    var unit = size.substr(-1, 2);
    return _.get(config, unit, 1) * parseFloat(size);
}
/**
 *
 * @param math
 * @param config: {
        inline: {
            boolean: true,
            default: true,
            describe: "process as inline math"
        },
        em: {
            default: 16,
            describe: 'em-size in pixels'
        },
        ex: {
            default: 8,
            describe: 'ex-size in pixels'
        },
        width: {
            default: 80 * 16,
            describe: 'width of container in pixels'
        },
        packages: {
            default: AllPackages,
            describe: 'the packages to use, e.g. "base, ams"'
        },
        css: {
            boolean: false,
            describe: 'output the required CSS rather than the SVG itself'
        },
        fontCache: {
            boolean: true,
            default: true,
            describe: 'whether to use a local font cache or not'
        }
    }
 */
function toSVG(math, config) {
    if (config === void 0) { config = {}; }
    var _opts = {
        inline: {
            boolean: true,
            default: true,
            describe: "process as inline math"
        },
        em: {
            default: 16,
            describe: 'em-size in pixels'
        },
        ex: {
            default: 8,
            describe: 'ex-size in pixels'
        },
        width: {
            default: 80 * 16,
            describe: 'width of container in pixels'
        },
        packages: {
            default: AllPackages,
            describe: 'the packages to use, e.g. "base, ams"'
        },
        css: {
            boolean: false,
            describe: 'output the required CSS rather than the SVG itself'
        },
        fontCache: {
            boolean: true,
            default: true,
            describe: 'whether to use a local font cache or not'
        }
    };
    var opts = _.defaultsDeep(config, _.mapValues(_opts, 'default'));
    //
    //  Create DOM adaptor and register it for HTML documents
    //
    var adaptor = liteAdaptor();
    RegisterHTMLHandler(adaptor);
    //
    //  Create input and output jax and a document using them on the content from the HTML file
    //
    var tex = new TeX({ packages: opts.packages });
    var svg = new SVG({ fontCache: (opts.fontCache ? 'local' : 'none') });
    var html = mathjax.document('', { InputJax: tex, OutputJax: svg });
    //
    //  Typeset the math from the command line
    //
    var node = html.convert(math, {
        display: !opts.inline,
        em: opts.em,
        ex: opts.ex,
        containerWidth: opts.width
    });
    //
    //  If the --css option was specified, output the CSS,
    //  Otherwise, typeset the math and output the HTML
    //
    var svgNode = adaptor.firstChild(node);
    var width = parseSize(adaptor.getAttribute(svgNode, 'width'), config);
    var height = parseSize(adaptor.getAttribute(svgNode, 'height'), config);
    return {
        math: math,
        svg: _.replace(opts.css ? adaptor.textContent(svg.styleSheet(html)) : adaptor.innerHTML(node), /xlink:xlink/g, 'xlink'),
        width: width,
        height: height,
        apprxWidth: width,
        apprxHeight: height
    };
}
export var TeXToSVG = _.memoize(toSVG);
//# sourceMappingURL=MathProvider.js.map