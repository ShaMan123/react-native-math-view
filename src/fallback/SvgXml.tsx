'use strict';

import React, { Ref, useMemo } from 'react';
import { SvgFromXml } from 'react-native-svg';
import { MathViewProps } from '../android/index';
import { styles } from '../common';
import MathjaxFactory from '../mathjax/index';

function SvgXml(props: MathViewProps, ref: Ref<any>) {
    const xmlProps = useMemo(() =>
        MathjaxFactory().toSVGXMLProps(props.math),
        [props.math]
    );

    return (
        <SvgFromXml
            {...props}
            style={[props.resizeMode === 'contain' && styles.contain, props.style]}
            ref={ref}
            {...xmlProps}
        />
    );
}

const FallbackMathView = React.forwardRef(SvgXml);

FallbackMathView.defaultProps = {
    color: 'black',
    resizeMode: 'contain'
} as MathViewProps;

FallbackMathView.displayName = 'FallbackMathView'

export default FallbackMathView;