
import React from 'react';
import MathText, { MathTextProps } from '../MathText';
import MathView from './SvgXml';

const MathTextFallback = React.memo((props: MathTextProps) => <MathText {...props} Component={MathView} />);

export const Constants = {};
export type { MathViewProps } from '../common';
export { default as MathjaxFactory } from '../mathjax';
export * from '../MathText';
export {
    MathView as default,
    MathTextFallback as MathText
};