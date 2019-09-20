import * as _ from 'lodash';
import { liteAdaptor } from 'mathjax-full/js/adaptors/liteAdaptor';
import { RegisterHTMLHandler } from 'mathjax-full/js/handlers/html';
import { TeX } from 'mathjax-full/js/input/tex';
import { AllPackages } from 'mathjax-full/js/input/tex/AllPackages';
import { mathjax } from 'mathjax-full/js/mathjax';
import { SVG } from 'mathjax-full/js/output/svg';

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
export function TeXToSVG(math/*: string*/, config/*: Partial<TeX2SVGConfig>*/ = {}) {
    const _opts = {
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

    const opts = _.defaultsDeep(config, _.mapValues(_opts, 'default'));
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

    return _.replace(opts.css ? adaptor.textContent(svg.styleSheet(html)) : adaptor.innerHTML(node), /xlink:xlink/g, 'xlink');
}