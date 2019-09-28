import { MathItem } from "mathjax-full/js/core/MathItem";
import { RenderMath } from "mathjax-full/js/core/MathDocument";

//require('mathjax-full/js/util/asyncLoad/node.js');
//require('mathjax-full/js/a11y/semantic-enrich.js');
import { STATE } from 'mathjax-full/js/core/MathItem';
//
//  Remove the data-semantic-* attributes other than data-semantic-speech
//
function removeSemanticData(math) {
    math.root.walkTree(node => {
        const attributes = node.attributes.getAllAttributes();
        delete attributes.xmlns;    // some internal nodes get this attribute for some reason
        for (const name of Object.keys(attributes)) {
            if (name.substr(0, 14) === 'data-semantic-' && name !== 'data-semantic-speech') {
                delete attributes[name];
            }
        }
    });
}

const renderMath: RenderMath<any, any, any> = (math, doc) => {
    const { start, end, bbox, math: latex } = math;
    return
}

//
//  The renderActions needed to remove the data-semantic-attributes.
//    STATE.ENRICHED is the priority of the enrichment, so this will rung just after enrichment.
//    The first function is the one for when the document's render() method is called.
//    The second is for when a MathItem's render(), rerender() or convert() method is called.
//
export const speechAction = {
    simplfy: [
        STATE.TYPESET + 1,
        (doc) => {
            console.log('m1')

            for (const math of doc.math) {
                //removeSemanticData(math);
            }
        },
        renderMath
    ]
};