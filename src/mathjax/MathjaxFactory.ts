import * as _ from 'lodash';
import { EnrichHandler } from 'mathjax-full/js/a11y/semantic-enrich';
import { LiteElement, LiteNode } from 'mathjax-full/js/adaptors/lite/Element';
import { liteAdaptor } from 'mathjax-full/js/adaptors/liteAdaptor';
import { MathDocument } from 'mathjax-full/js/core/MathDocument';
import { RegisterHTMLHandler } from 'mathjax-full/js/handlers/html';
import { TeX } from 'mathjax-full/js/input/tex';
import TexParser from 'mathjax-full/js/input/tex/TexParser';
import { mathjax } from 'mathjax-full/js/mathjax';
import { SVG } from 'mathjax-full/js/output/svg';
import { LayoutRectangle } from 'react-native';
import * as matrixUtil from 'transformation-matrix';
import { MathToSVGConfig, mathToSVGDefaultConfig } from './Config';

import { MathML } from 'mathjax-full/js/input/mathml';
import { MathList } from 'mathjax-full/js/core/MathList';
import { MathItem } from 'mathjax-full/js/core/MathItem';
import { HTMLMathItem } from 'mathjax-full/js/handlers/html/HTMLMathItem';
import { speechAction } from './SpeechAction';
import { BBox } from 'mathjax-full/ts/core/MathItem';
import * as TreeWalker from './TreeWalker';
//import { MmlFactory } from 'mathjax-full/js/core/MmlTree/MmlFactory';
/*
declare const global: any;
global.SRE_JSON_PATH = '../../node_modules/speech-rule-engine/lib/mathmaps';
import SRE from 'speech-rule-engine/lib/sre';
global.SRE = SRE;
global.sre = Object.create(SRE);
global.sre.Engine = { isReady() { return SRE.engineReady() } };
//import 'mathjax-full/js/a11y/sre-node';

mathjax.asyncLoad = (name: string) => console.log('asunload', name);

console.log(sre)
*/
const compose = matrixUtil.transform;

export interface MathFragmentResponse {
    node: LiteElement,
    svg: string,
    namespace: {
        ns: string,
        localCahceId: string,
        input: string,
        variant: string,
        charCode16: string,
        charCode: number,
        char: string,
    },
    viewBox: LayoutRectangle,
    index: number
}

function parseSize(size: string | number, config: Partial<MathToSVGConfig> = {}) {
    if (typeof size === 'number') return size;
    const unit = size.substr(-2);
    return _.get(config, unit, 1) * parseFloat(size);
}

export class MathjaxAdaptor {
    private html: MathDocument<any, any, any>;
    private tex: TeX<{}, {}, {}>;   //  html.inputJax
    private svg: SVG<{}, {}, {}>;    //  html.outputJax
    options: MathToSVGConfig;
    key = _.uniqueId('MathjaxAdaptor')

    constructor(options: MathToSVGConfig) {
        this.options = options;

        //
        //  Create DOM adaptor and register it for HTML documents
        //
        const adaptor = liteAdaptor();
        const htmlHander = RegisterHTMLHandler(adaptor);
        //EnrichHandler(htmlHander, new MathML());

        //
        //  Create input and output jax and a document using them on the content from the HTML file
        //
        this.tex = new TeX({ packages: options.packages });
        this.svg = new SVG({
            fontCache: (options.fontCache ? 'local' : 'none'),
            internalSpeechTitles: true
        });
        
        this.html = mathjax.document('', {
            InputJax: this.tex,
            OutputJax: this.svg
            //enrichSpeech: options.enrichSpeech
        });

        //this.html.addRenderAction('mip', ...speechAction.simplfy);
    }

    protected get adaptor() {
        return this.html.adaptor as ReturnType<typeof liteAdaptor>;
    }

    protected get mmlFactory() {
        return this.html.mmlFactory;
    }

    protected get convertOptions() {
        return {
            display: !this.options.inline,
            em: this.options.em,
            ex: this.options.ex,
            containerWidth: this.options.width,
        }
    }

    protected get parseOptions() {
        return this.tex.parseOptions;
    }

    static parseSVG(svg: string) {
        return _.replace(svg, /xlink:xlink/g, 'xlink');
    }

    convert = _.memoize((math: string) => {
        return this.html.convert(math, this.convertOptions) as LiteElement;
    })

    splitMath = _.memoize((math: string) => {
        let parser = new TexParser(
            math,
            { display: true, isInner: false },
            this.parseOptions
        );

        parser.i = 0;   //  reset parser
        const response = [];
        while (parser.i < parser.string.length) {
            response.push(parser.GetArgument(math, true))
        }
        /*
         * try to compose bbox
        const mathItems = _.map(response, (frag, index, collection) => {
            const bip = new HTMLMathItem(frag, this.tex, true);
            bip.compile(this.html.document)
            bip.bbox = this.svg.getBBox(bip, this.html);
            return bip;
        });

        _.reduce(mathItems, (acc, val) => {
            const { w, h, d } = val.bbox;
            _.set(val.bbox, 'x', acc);
            return acc + w;
        }, 0);

        console.log(_.map(mathItems, (m)=>[m.bbox, m.math]))
       */
        return response as string[];
    })

    toSVG = _.memoize((math: string) => {
        const node = this.convert(math);
        return MathjaxAdaptor.parseSVG(this.adaptor.innerHTML(node)) as string; //   css option won't be used in react-native context    //   opts.css ? adaptor.textContent(svg.styleSheet(html)) : adaptor.innerHTML(node);
    })

    toSVGArray(math: string) {
        /*
        return _.map(this.splitMath(math), this.toSVG.bind(this)) as string[];
        */
        const svgNode = this.adaptor.firstChild(this.convert(math)) as LiteElement;
        const startMatrix = this.transformationToMatrix(svgNode);

        const viewBox = _.map(_.split(svgNode.attributes['viewBox'], ' '), parseFloat);
        const [vbX, vbY, vbWidth, vbHeight] = viewBox;

        const useCollection = _.compact(TreeWalker.walkDown(svgNode, (n, level) => !TreeWalker.reject(n) && n.kind === 'use' && n /*n.children.length === 0 && n*/));

        const transforms = _.map(useCollection, (node) => this.accTransformations(node));

        const viewBoxes = _.map(transforms, (mat, index, collection) => {
            const box = _.clone(viewBox);
            const x = mat.e - startMatrix.e;
            const y = mat.f - startMatrix.f;
            //const sx = Math.abs(mat.a * startMatrix.a);
            //const sy = Math.abs(mat.d * startMatrix.d);
            const width = _.get(collection, `${index + 1}.e`, vbWidth) - mat.e;
            const height = box[3];

            const h = _.mapValues({ x, width }, (value, key) => value / vbWidth);
            const v = _.mapValues({ y, height }, (value, key) => value / vbHeight);

            return _.assign({}, h, v);
        });
        

        const responseArr = _.map(useCollection, (node, index) => {
            const n = this.adaptor.clone(node);
            const transform = this.accTransformations(node);

            const xlinkHref = _.get(node.attributes, 'xlink:xlink:href', _.get(node.attributes, 'xlink:href'));
            const splitId = _.split(xlinkHref, '-');
            const charCode = parseInt(_.last(splitId) as string, 16);
            const char = String.fromCharCode(charCode);
            const namespace = _.zipObject(['ns', 'localCahceId', 'input', 'variant', 'charCode16', 'charCode', 'char'], _.concat(splitId, charCode, char));

            this.adaptor.setAttribute(n, 'transform', matrixUtil.toSVG(transform));

            const clone = this.adaptor.clone(svgNode);
            clone.children = [clone.children[0], n];
            
            return {
                node: clone,
                svg: MathjaxAdaptor.parseSVG(this.adaptor.outerHTML(clone)),
                namespace,
                index
            };
        });

        return _.zipWith(responseArr, viewBoxes, (res, viewBox) => _.assign(res, ({ viewBox }))) as MathFragmentResponse[];
        
    }

    transformationToMatrix(node: LiteElement) {
        const transformAttr = _.get(node.attributes, 'transform', null);
        const xAttr = _.get(node.attributes, 'x', 0);
        const yAttr = _.get(node.attributes, 'y', 0);

        if (!transformAttr) return compose(matrixUtil.translate(0));

        const matrices = _.map(matrixUtil.fromTransformAttribute(transformAttr) as matrixUtil.MatrixDescriptor[], (mat) => {
            switch (mat.type) {
                case 'matrix':
                    return mat;
                case 'translate':
                    return compose(matrixUtil.translate(mat.tx, mat.ty || 0));
                case 'scale':
                    return compose(matrixUtil.scale(mat.sx || 1, mat.sy || mat.sx || 1));
                default:
                    throw new Error(`Mathjax transformation accumulator unhandled command ${mat.type}`);
            }
        });
        
        return compose(matrixUtil.translate(xAttr, yAttr), ...matrices);
    }

    accTransformations(node: LiteElement) {
        const matrices = TreeWalker.walkUp<matrixUtil.Matrix>(node, (n, level, acc) => {
            return this.transformationToMatrix(n);
        });

        return compose(..._.reverse(matrices));
    }   

    /**
     * doesn't seem to increase performance dramatically, maybe even the opposite
     * use at own risk
     * @param mathArray
     */
    preload(mathArray: string[]) {
        if (_.size(mathArray) > 0) {
            setTimeout(() => {
                _.map(mathArray, (math) => this.toSVG(math));
                if (__DEV__) console.log('react-native-math-view: Mathjax preload completed');
            }, 0);
        }
    }
}

export const FactoryMemoize = _.memoize((stringifiedOptions: string) => new MathjaxAdaptor(JSON.parse(stringifiedOptions) as MathToSVGConfig));

export default function (config?: Partial<MathToSVGConfig>) {
    return FactoryMemoize(JSON.stringify(_.defaultsDeep(config || {}, mathToSVGDefaultConfig)));
}