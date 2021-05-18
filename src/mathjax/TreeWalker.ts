import * as _ from 'lodash';
import { LiteElement, LiteNode } from 'mathjax-full/js/adaptors/lite/Element';

export type TreeWalkerCallback<N, T> = (node: N, level: number, accum: T[], quit: () => void) => T;

export type Child<T = {}> = {
    parent?: Child<T>
} & T

export type Parent<T = {}> = {
    children?: Parent<T>[]
} & T

/**
 * walk up the tree starting at {node}
 * @param node the node to start climbing from
 * @param callback
 * @returns accumulated array of {callback} responses
 */
export function walkUp<N extends Child | LiteElement = LiteElement, T = LiteElement>(node: N, callback: TreeWalkerCallback<N, T>) {
    let n: N = node;
    let i = 0;
    let _break = false;
    const quit = () => { _break = true };
    const accum: T[] = [];
    while (n.parent && !_break) {
        accum.push(callback(n, i, accum, quit));
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
export function walkDown<N extends Parent | LiteElement = LiteElement, T = LiteElement>(node: N, callback: TreeWalkerCallback<N, T>) {
    let stack = [] as N[];
    let n: N | undefined = node;
    let i = 0;
    let _break = false;
    const quit = () => { _break = true };
    const accum: T[] = [];
    let children: N[];

    while (n) {
        i = _.get(n, 'attributes.pLevel', 0);
        accum.push(callback(n, i, accum, quit));
        children = _.get(n, 'children', []) as N[];

        if (_.size(children) > 0) {
            children = _.map(children, (child: N) => _.set(child, 'attributes.pLevel', i + 1));
            stack = _.concat(children, stack);
        }

        n = stack.shift();
    }
    return accum;
}

export function reject(node: LiteNode) {
    return node.kind === '#text' || node.kind === '#comment';
}