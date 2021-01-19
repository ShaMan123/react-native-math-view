
import React from 'react';
import MathText, { MathTextProps } from '../MathText';
import MathView from './SvgXml';

const MathTextFallback = React.memo((props: MathTextProps) => <MathText {...props} Component={MathView} />);

export * from '../MathText';
export {
    MathView as default,
    MathTextFallback as MathText
};