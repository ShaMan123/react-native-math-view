'use strict';

import React, { forwardRef } from 'react';
import { MathViewProps } from 'src/common';
import FragmentedMathView from './FragmentedMathView';
import MathView from './MathView';


export interface MathViewControllerProps extends MathViewProps {
    action: 'edit' | 'none'
}

/**
 * a controller that renders {MathView} or {} depending on `editable` state
 * @param props
 * @param ref
 */
const MathViewController = forwardRef((props: MathViewControllerProps, ref: any) => {
    return props.action === 'edit' ? <FragmentedMathView {...props} ref={ref} /> : <MathView {...props} ref={ref} />;
});

MathViewController.defaultProps = {
    action: 'none'
} as Partial<MathViewControllerProps>;

export default MathViewController;
