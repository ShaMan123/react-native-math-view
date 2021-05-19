'use strict';

import React from 'react';
import { MathViewInjectedProps, MathViewProps } from '../common';
import { ErrorComponent } from '../Error';
import { mathViewRender } from '../hooks';
import MathBaseView from './MathBaseView';

/**
 * uses async rendering for better performance in combination with memoization
 * read more in source files
 * @param props
 * @param ref
 */
const MathView = mathViewRender((props: MathViewInjectedProps, ref: any) => {
    return (
        <MathBaseView
            {...props}
            ref={ref}
        />
    );
}, { async: true });

MathBaseView.defaultProps = {
    resizeMode: 'contain',
    config: {}
} as Partial<MathViewInjectedProps>;

MathView.defaultProps = {
    ...MathBaseView.defaultProps,
    renderError: ErrorComponent
} as Partial<MathViewProps>;

export default MathView;

