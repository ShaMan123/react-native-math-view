'use strict';

import React, { Ref } from 'react';
import { SvgFromXml } from 'react-native-svg';
import { MathViewProps } from '../android/index';
import { styles } from '../common';
import MathjaxFactory from '../mathjax/index';

function SvgXml(props: MathViewProps, ref: Ref<any>) {
    return (
        <SvgFromXml
            {...props}
            style={[props.resizeMode === 'contain' && styles.contain, props.style]}
            ref={ref}
            {...MathjaxFactory(props.config).toSVGXMLProps(props.math)}
        />
    );
}

const FallbackMathView = React.forwardRef(SvgXml);

FallbackMathView.defaultProps = {
    color: 'black',
    resizeMode: 'cover'
} as MathViewProps;

FallbackMathView.displayName = 'FallbackMathView';

export default FallbackMathView;
