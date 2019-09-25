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
function toSVG(math: string, config: Partial<MathToSVGConfig> = {pip:false}) {
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

    const nodeList = buildMathSVGArray(adaptor.clone(adaptor.firstChild(node)));
    const response = _.map(nodeList, node => _.replace(adaptor.outerHTML(node), /xlink:xlink/g, 'xlink'))
    
   // console.log(response,'____________________________________________________________________________')

    const stringSVG = _.replace(opts.css ? adaptor.textContent(svg.styleSheet(html)) : adaptor.innerHTML(node), /xlink:xlink/g, 'xlink');

    return config.pip ? response: stringSVG;
}

function buildMathSVGArray(node: any) {
    let pathToDefs: Array<number | string> = [0];
    const response: any[] = [];
    recurseThroughTree(node, (childNode, path) => {
        if (childNode.kind === 'defs') pathToDefs = path;
        else if (_.startsWith(_.join(path), _.join(pathToDefs))) return;

        if (childNode.kind === 'use') {
            console.log(path, childNode.attributes)
            const treeNodeList = _.map(_.without(path, 'children'), (key, index, collection) => {
                const p = _.slice(collection, 0, index + 1);
                console.log('ptpt', p)
                return _.get(node, _.flatten(_.map(p, seg => (['children', seg]))));
            });
            
            const tree = _.reduceRight(_.initial(treeNodeList), (prev, curr, index, list) => {
                return _.assign({}, curr, { children: [prev] });
            }, _.last(treeNodeList));
            
            response.push(_.set(_.assign({}, node), 'children', [_.get(node, `children.0`), tree]));

            //console.log(adaptor.outerHTML(tree))
          //  return tree;
        }
        //console.log(node.kind, _.size(node.children) === 0, _.isEqual(node, _.get(svgNode, path)))
    });

    return response;
}

function recurseThroughTree(node: any, callback: (node: string, path: string[]) => any, path: string[] = []) {
    path.push('children');
    _.map(node.children, (child, key) => {
        const p = _.concat(path, key);
        callback(child, p)
        recurseThroughTree(child, callback, p)
    });
}

export const mathToSVG = _.memoize(toSVG);