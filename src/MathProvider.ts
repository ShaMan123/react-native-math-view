import * as _ from 'lodash';
import { LiteElement } from 'mathjax-full/js/adaptors/lite/Element';
import { liteAdaptor } from 'mathjax-full/js/adaptors/liteAdaptor';
import { RegisterHTMLHandler } from 'mathjax-full/js/handlers/html';
import { TeX } from 'mathjax-full/js/input/tex';
import TexParser from 'mathjax-full/js/input/tex/TexParser';
import { mathjax } from 'mathjax-full/js/mathjax';
import { SVG } from 'mathjax-full/js/output/svg';
import { MathToSVGConfig, mathToSVGDefaultConfig } from './Config';

function parseSize(size: string | number, config: Partial<MathToSVGConfig> = {}) {
    if (typeof size === 'number') return size;
    const unit = size.substr(-2);
    return _.get(config, unit, 1) * parseFloat(size);
}

/**
 * init Mathjax classes
 * @param config
 */
export default function MathjaxFactory(config?: Partial<MathToSVGConfig>) {
    const options = _.defaultsDeep(config || {}, mathToSVGDefaultConfig) as MathToSVGConfig;
    //
    //  Create DOM adaptor and register it for HTML documents
    //
    const adaptor = liteAdaptor();
    RegisterHTMLHandler(adaptor);

    //
    //  Create input and output jax and a document using them on the content from the HTML file
    //
    const tex = new TeX({ packages: options.packages });
    const svg = new SVG({ fontCache: (options.fontCache ? 'local' : 'none') });
    const html = mathjax.document('', { InputJax: tex, OutputJax: svg });

    const convertOptions = {
        display: !options.inline,
        em: options.em,
        ex: options.ex,
        containerWidth: options.width
    }
    
    return {
        html,
        tex,    //  html.inputJax
        svg,    //  html.outputJax
        options,
        parseSVG(svg: string) {
            return _.replace(svg, /xlink:xlink/g, 'xlink');
        },
        convert(math: string) {
            return html.convert(math, convertOptions) as LiteElement
        },
        splitMath(math: string) {
            let parser = new TexParser(
                math,
                { display: true, isInner: false },
                tex.parseOptions
            );

            parser.i = 0;   //  reset parser
            const response = [];
            while (parser.i < parser.string.length) {
                response.push(parser.GetArgument(math, true))
            }
            return response;
        },
        toSVG(math: string) {
            const node = this.convert(math);
            return this.parseSVG(adaptor.innerHTML(node)); //   css option won't be used in react-native context    //   opts.css ? adaptor.textContent(svg.styleSheet(html)) : adaptor.innerHTML(node);
        },
        toSVGArray(math: string) {
            return _.map(this.splitMath(math), this.convert);
            /*
            const nodeList = breakIntoSeperateTrees(adaptor.clone(adaptor.firstChild(this.convert(math)));
            const response = _.map(nodeList, node => this.parseSVG(adaptor.outerHTML(node)));
            */
        }
    };
}


/**
 * This method iterate through the entire node and breaks it up into seperate SVG node,
 * each containing a single leaf and it's entire tree
 * This was developed in order to manage seperate symbols in a math string
 * @param node adaptor.firstChild(node)
 */
export function breakIntoSeperateTrees(node: any) {
    let pathToDefs: Array<number | string> = [0];
    const response: any[] = [];
    //console.log( node.attributes)
    recurseThroughTree(node, (childNode, path) => {
        if (childNode.kind === 'defs') pathToDefs = path;
        else if (_.startsWith(_.join(path), _.join(pathToDefs))) return;

        if (childNode.kind === 'use') {

            const treeNodeList = _.map(_.without(path, 'children'), (key, index, collection) => {
                const p = _.slice(collection, 0, index + 1);
                return _.get(node, _.flatten(_.map(p, seg => (['children', seg]))));
            });

            const tree = _.reduceRight(_.initial(treeNodeList), (prev, curr, index, list) => {
                return _.assign({}, curr, { children: [prev] });
            }, _.last(treeNodeList));

            response.push(_.set(_.assign({}, node), 'children', [_.get(node, `children.0`), tree]));
        }
    });

    return response;
}

function recurseThroughTree(node: any, callback: (node: any, path: string[]) => any, path: string[] = []) {
    path.push('children');
    _.map(node.children, (child, key) => {
        const p = _.concat(path, key);
        callback(child, p)
        recurseThroughTree(child, callback, p)
    });
}

