'use strict';

import React from 'react';
import { ErrorComponent, MathViewProps, mathViewAsyncRenderer, mathViewRender } from '../common';
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

