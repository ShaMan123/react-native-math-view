'use strict';

import React, { Ref } from 'react';
import { SvgFromXml } from 'react-native-svg';
import { MathViewProps, styles } from '../common';
import { ErrorComponent } from '../Error';
import { mathViewRender } from '../hooks';

const FallbackMathView = mathViewRender('svg-xml', false, (props: MathViewProps, ref: Ref<any>) => {
    return (
        <SvgFromXml
            {...props}
            style={[props.resizeMode === 'contain' && styles.contain, props.style]}
            ref={ref}
        />
    )
});

FallbackMathView.defaultProps = {
    color: 'black',
    resizeMode: 'cover',
    renderError: ErrorComponent
} as Partial<MathViewProps>;

export default FallbackMathView;
