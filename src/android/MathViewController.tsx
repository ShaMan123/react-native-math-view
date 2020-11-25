'use strict';

import React, { forwardRef } from 'react';
import { MathViewProps } from 'src/common';
import FragmentedMathView from './FragmentedMathView';
import MathView, { ControlledMathView } from './MathView';


export interface MathViewControllerProps extends MathViewProps {
    action: 'edit' | 'none'
}

/**
 * a controller that renders {MathView} or {} depending on `editable` state
 * @param props
 * @param ref
 */
function MathViewController(props: MathViewControllerProps, ref: any) {
    return props.action === 'edit' ? <FragmentedMathView {...props} ref={ref} /> : <MathView {...props} ref={ref} />;
}

const MathViewControllerWrapper = forwardRef(MathViewController);

MathViewControllerWrapper.defaultProps = {
    action: 'none'
} as Partial<MathViewControllerProps>;

//@ts-ignore
MathViewControllerWrapper.Constants = ControlledMathView.Constants;
//@ts-ignore
MathViewControllerWrapper.getPreserveAspectRatio = ControlledMathView.getPreserveAspectRatio;

export default MathViewControllerWrapper;
