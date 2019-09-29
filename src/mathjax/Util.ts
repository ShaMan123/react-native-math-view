import * as _ from "lodash";
import { LiteElement } from "mathjax-full/js/adaptors/lite/Element";
import * as matrixUtil from 'transformation-matrix';
import * as TreeWalker from './TreeWalker';

export const compose = matrixUtil.transform;

/**
 * fix mathjax output
 * @param svg
 */
export function parseSVG(svg: string) {
    return _.replace(svg, /xlink:xlink/g, 'xlink');
}

/**
 * extract mainly the char of the path being used
 * based on mathjax id constructor: mathjax-full/ts/output/svg/FontCache.ts #cachePath
 * @param node
 */
export function extractDataFromMathjaxId(node: LiteElement) {
    const xlinkHref = _.get(node.attributes, 'xlink:xlink:href', _.get(node.attributes, 'xlink:href', _.get(node.attributes, 'href', _.get(node.attributes, 'id'))));
    const splitId = _.split(xlinkHref, '-');
    const charCode = parseInt(_.last(splitId) as string, 16);
    const char = String.fromCharCode(charCode);
    return _.zipObject(['ns', 'localCahceId', 'input', 'variant', 'charCode16', 'charCode', 'char'], _.concat(splitId, charCode, char));
}

/**
 * extracts transform attribute and return as {Matrix}
 * @param node
 * @param attributeKey the key of the transform attribute to extract
 */
export function transformationToMatrix(node: LiteElement, attributeKey = 'transform') {
    const transformAttr = _.get(node.attributes, attributeKey, null);
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

/**
 * accumulate all transformations for this node and up the tree
 * makes it possible to draw the node in a shallow svg tree while preserving it's exact layout
 * @param node
 */
export function accTransformations(node: LiteElement) {
    const matrices = TreeWalker.walkUp<matrixUtil.Matrix>(node, (n, level, acc) => {
        return transformationToMatrix(n);
    });

    return compose(..._.reverse(matrices));
}

export class Memoize {
    cache: any[] = [];
    clearCache() {
        this.cache = [];
    }
}