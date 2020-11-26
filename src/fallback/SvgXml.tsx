'use strict';

import React, { forwardRef, Ref } from 'react';
import { SvgFromXml } from 'react-native-svg';
import { ErrorComponent, mathErrorBoundary, MathViewProps, styles } from '../common';
import MathjaxFactory from '../mathjax';

const FallbackMathView = forwardRef((props: MathViewProps, ref: Ref<any>) => {
    try {
        const svgXmlProps = MathjaxFactory(props.config).toSVGXMLProps(props.math);
        return (
            <SvgFromXml
                {...props}
                style={[props.resizeMode === 'contain' && styles.contain, props.style]}
                ref={ref}
                {...svgXmlProps}
            />
        );
    } catch (error) {
        return mathErrorBoundary(error, props);
    }
});

FallbackMathView.defaultProps = {
    color: 'black',
    resizeMode: 'cover',
    renderError: ErrorComponent
} as Partial<MathViewProps>;

export default FallbackMathView;
