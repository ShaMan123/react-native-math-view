'use strict';

import React from 'react';
import { MathViewProps } from '../common';
import { ErrorComponent } from '../Error';
import { mathViewRender } from '../hooks';
import MathBaseView, { MathViewBaseProps } from './MathBaseView';

/**
 * uses async rendering for better performance in combination with memoization
 * read more in source files
 * @param props
 * @param ref
 */
const MathView = mathViewRender('svg', true, (props: MathViewBaseProps, ref: any) => {
    return (
        <MathBaseView
            {...props}
            ref={ref}
        />
    );
});

MathBaseView.defaultProps = {
    resizeMode: 'contain',
    config: {}
} as Partial<MathViewBaseProps>;

MathView.defaultProps = {
    ...MathBaseView.defaultProps,
    renderError: ErrorComponent
} as Partial<MathViewProps>;

export default MathView;

