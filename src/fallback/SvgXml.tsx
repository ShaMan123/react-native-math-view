'use strict';

import React, { Ref } from 'react';
import { SvgFromXml } from 'react-native-svg';
import { ErrorComponent, MathViewProps, styles } from '../common';
import MathjaxFactory from '../mathjax/index';

function SvgXml(props: MathViewProps, ref: Ref<any>) {
    try {
        const svgXmlProps = MathjaxFactory(props.config).toSVGXMLProps(props.math)
        return (
            <SvgFromXml
                {...props}
                style={[props.resizeMode === 'contain' && styles.contain, props.style]}
                ref={ref}
                {...svgXmlProps}
            />
        );
    } catch (error) {
        const { renderError: Fallback } = props;
        return typeof Fallback === 'function' ?
            <Fallback
                error={`${error}`}    //escape \
                {...props}
            /> :
            React.isValidElement(Fallback) ?
                Fallback :
                null;
    }
}

const FallbackMathView = React.forwardRef(SvgXml);

FallbackMathView.defaultProps = {
    color: 'black',
    resizeMode: 'cover',
    renderError: ErrorComponent
} as Partial<MathViewProps>;

FallbackMathView.displayName = 'FallbackMathView';

export default FallbackMathView;
