import _ from 'lodash';
import { EnrichHandler } from 'mathjax-full/js/a11y/semantic-enrich';
import { LiteElement, LiteNode } from 'mathjax-full/js/adaptors/lite/Element';
import { liteAdaptor } from 'mathjax-full/js/adaptors/liteAdaptor';
import { MathDocument } from 'mathjax-full/js/core/MathDocument';
import { RegisterHTMLHandler } from 'mathjax-full/js/handlers/html';
import { TeX } from 'mathjax-full/js/input/tex';
import TexParser from 'mathjax-full/js/input/tex/TexParser';
import { mathjax } from 'mathjax-full/js/mathjax';
import { SVG } from 'mathjax-full/js/output/svg';
import { STATE } from 'mathjax-full/js/core/MathItem';
import { LayoutRectangle } from 'react-native';
import * as matrixUtil from 'transformation-matrix';
import { MathToSVGConfig, mathToSVGDefaultConfig } from './Config';
import { accTransformations, compose, extractDataFromMathjaxId, parseSVG, transformationToMatrix, Memoize } from './Util';
/*
import { MathML } from 'mathjax-full/js/input/mathml';
import { MathList } from 'mathjax-full/js/core/MathList';
import { MathItem } from 'mathjax-full/js/core/MathItem';
import { HTMLMathItem } from 'mathjax-full/js/handlers/html/HTMLMathItem';
import { speechAction } from './SpeechAction';
import { BBox } from 'mathjax-full/ts/core/MathItem';
*/
import * as TreeWalker from './TreeWalker';
import TexError from 'mathjax-full/js/input/tex/TexError';
import { MathError } from '../common';
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

const ERROR_MAP = new Map<string, { id: string, message: string }>();

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

class ConvertMemoize extends Memoize {
    cache: Array<{ math: string, options: MathToSVGConfig, mathElement: LiteElement }> = [];
    covert(math: string, options: MathToSVGConfig, doc: MathDocument<any, any, any>) {
        const cached = this.get(math, options);
        if (_.isNil(cached)) {
            const mathElement = doc.convert(math, ConvertMemoize.getConvertOptions(options)) as LiteElement;
            const isError = doc.inputJax[0].parseOptions.error;
            if (isError) {
                const error = new Error(ERROR_MAP.get(math)?.message || '');
                error.name = MathError.parsing;
                throw error;
            }
            this.cache.push({ math, options, mathElement });
            return mathElement;
        }
        else {
            return cached;
        }
    }

    get(math: string, options: MathToSVGConfig) {
        const item = _.find(this.cache, (item) => _.isEqual(math, item.math) && _.isEqual(options, item.options));
        return _.get(item, 'mathElement');
    }

    static getConvertOptions(options: MathToSVGConfig) {
        return {
            display: !options.inline,
            em: options.em,
            ex: options.ex,
            containerWidth: options.width,
        }
    }
}

export const converter = new ConvertMemoize();

export default class MathjaxAdaptor {
    private html: MathDocument<any, any, any>;
    private tex: TeX<{}, {}, {}>;   //  html.inputJax
    private svg: SVG<{}, {}, {}>;    //  html.outputJax
    options: MathToSVGConfig;
    key = _.uniqueId('MathjaxAdaptor')

    static converter = converter;

    constructor(options: MathToSVGConfig) {
        this.options = options;

        //
        //  Create DOM adaptor and register it for HTML documents
        //
        const adaptor = liteAdaptor();
        const htmlHandler = RegisterHTMLHandler(adaptor);
        //EnrichHandler(htmlHander, new MathML());

        //
        //  Create input and output jax and a document using them on the content from the HTML file
        //
        this.tex = new TeX({
            packages: options.packages,
            inlineMath: options.inlineMath,
            displayMath: options.displayMath,
            formatError: (jax: TeX<any, any, any>, err: TexError) => {
                const math = jax.latex;
                __DEV__ && console.warn('MathView: LaTex parsing Error', { ...err, math });
                ERROR_MAP.set(math, err);
                return jax.formatError(err);
            },
        });

        this.svg = new SVG({
            fontCache: options.fontCache ? 'local' : 'none',
            internalSpeechTitles: true,
            displayAlign: options.displayAlign
        });

        this.html = mathjax.document('', {
            InputJax: this.tex,
            OutputJax: this.svg,
            //compileError: () => console.error('ds'),
            //typesetError: () => console.error('ds'),

            //enrichSpeech: options.enrichSpeech
        });
        /*
                this.html.addRenderAction(
                    'mip',
                    STATE.COMPILE + 1,
                    (doc) => { },
                    (math, doc) => console.log(this.tex.parseOptions.error, doc.inputJax[0].latex)
                );
        */
    }

    protected get adaptor() {
        return this.html.adaptor as ReturnType<typeof liteAdaptor>;
    }

    protected get mmlFactory() {
        return this.html.mmlFactory;
    }

    protected get parseOptions() {
        return this.tex.parseOptions;
    }

    static parseSVG(svg: string) {
        return _.replace(svg, /xlink:xlink/g, 'xlink');
    }

    convert = _.memoize((math: string) => {
        return converter.covert(math, this.options, this.html);
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
        return parseSVG(this.adaptor.innerHTML(node)) as string; //   css option won't be used in react-native context    //   opts.css ? adaptor.textContent(svg.styleSheet(html)) : adaptor.innerHTML(node);
    })

    toSVGXMLProps = _.memoize((math: string) => {
        const node = this.convert(math);
        const svgNode = this.adaptor.firstChild(node) as LiteElement;
        const svg = parseSVG(this.adaptor.innerHTML(node)) as string;
        const width = parseSize(this.adaptor.getAttribute(svgNode, 'width'), this.options);
        const height = parseSize(this.adaptor.getAttribute(svgNode, 'height'), this.options);

        return {
            xml: svg,
            width,
            height
        }
    })

    toSVGArray(math: string) {
        /*
        return _.map(this.splitMath(math), this.toSVG.bind(this)) as string[];
        */
        const mathElement = this.convert(math);
        const svgNode = this.adaptor.firstChild(mathElement) as LiteElement;
        const startMatrix = transformationToMatrix(svgNode);
        const viewBox = _.map(_.split(svgNode.attributes['viewBox'], ' '), parseFloat);
        const [vbX, vbY, vbWidth, vbHeight] = viewBox;

        //  legacy approach
        //  slower - too many loops
        //const useCollection = _.compact(TreeWalker.walkDown(svgNode, (n, level) => !TreeWalker.reject(n) && n.kind === 'use' && n /*n.children.length === 0 && n*/));
        /*
        const transforms = _.map(useCollection, (node) => accTransformations(node));

        const responseArr = _.map(useCollection, (node, index) => {
            const n = this.adaptor.clone(node);
            const transform = accTransformations(node);

            this.adaptor.setAttribute(n, 'transform', matrixUtil.toSVG(transform));

            const clone = this.adaptor.clone(svgNode);
            clone.children = [clone.children[0], n];

            return {
                node: clone,
                svg: MathjaxAdaptor.parseSVG(this.adaptor.outerHTML(clone)),
                namespace: extractDataFromMathjaxId(node),
                index
            };
        });
        */

        const clone = this.adaptor.clone(mathElement);
        const tempKey = 'accTransform';
        const pathToTempAttr = `attributes.${tempKey}`;
        const pathToAttr = 'attributes.transform';
        const collection = TreeWalker.walkDown<LiteElement>(clone, (n, l) => {
            if (l === 0) return _.set(n, pathToTempAttr, _.get(n, pathToAttr, ''));
            const mat = compose(transformationToMatrix(n.parent, tempKey), transformationToMatrix(n));
            const accTransformAttr = matrixUtil.toSVG(mat);
            return _.set(n, pathToTempAttr, accTransformAttr);
        });

        const transforms = [] as matrixUtil.Matrix[];
        const useCollection = _.filter(collection, (n) => {
            if (!TreeWalker.reject(n) && n.kind === 'use') {  //n.children.length === 0 && n
                transforms.push(transformationToMatrix(n, tempKey));
                return n;
            }
        }) as LiteElement[];

        const responseArr = _.map(useCollection, (node, index) => {
            const n = this.adaptor.clone(node);
            _.set(n, pathToAttr, _.get(n, pathToTempAttr));

            const clone = this.adaptor.clone(svgNode);
            clone.children = [clone.children[0], n];

            return {
                node: clone,
                svg: parseSVG(this.adaptor.outerHTML(clone)),
                namespace: extractDataFromMathjaxId(node),
                index
            };
        });

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

        return _.zipWith(responseArr, viewBoxes, (res, viewBox) => _.assign(res, ({ viewBox }))) as MathFragmentResponse[];

    }



    /**
     * doesn't seem to increase performance dramatically, maybe even the opposite
     * use at own risk
     * @param mathArray
     */
    preload(mathArray: string[]) {
        if (_.size(mathArray) > 0) {
            setTimeout(() => {
                _.forEach(mathArray, (math) => {
                    try {
                        return this.toSVG(math)
                    } catch (error) { }
                });
                if (__DEV__) console.log('react-native-math-view: Mathjax preload completed');
            }, 0);
        }
    }
}