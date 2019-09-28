import * as _ from 'lodash';
import { LiteElement, LiteNode } from 'mathjax-full/js/adaptors/lite/Element';

export type TreeWalkerCallback<T> = (node: LiteElement, level: number, accum: T[]) => T

/**
 * walk up the tree starting at {node}
 * @param node the node to start climbing from
 * @param callback
 * @returns accumulated array of {callback} responses
 */
export function walkUp<T>(node: LiteElement, callback: TreeWalkerCallback<T>) {
    let n = node;
    let i = 0;
    const accum: T[] = [];
    while (n.parent) {
        accum.push(callback(n, i, accum));
        i++;
        n = n.parent;
    }
    return accum;
}

/**
 * walk down the tree starting at {node}
 * @param node the node to start descending from
 * @param callback
 * @returns accumulated array of {callback} responses
 */
export function walkDown<T>(node: LiteElement, callback: TreeWalkerCallback<T>) {
    let stack = [] as LiteElement[];
    let n: LiteElement = node;
    let i = 0;
    const accum: T[] = [];
    let children: LiteElement[];

    while (n) {
        i = _.get(n, 'attributes.pLevel', 0);
        accum.push(callback(n as LiteElement, i, accum));
        children = _.get(n, 'children', []) as LiteElement[];

        if (_.size(children) > 0) {
            _.forEach(children, child => _.set(child, 'pLevel', i + 1));
            stack = _.concat(children, stack);
        }

        n = stack.shift();
    }
    return accum;
}

export function reject(node: LiteNode) {
    return node.kind === '#text' || node.kind === '#comment';
}