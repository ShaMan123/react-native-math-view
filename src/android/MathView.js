'use strict';
import React from 'react';
import SVGMathView from './SVGMathView';
import { Context } from './MathProvider';

class MathView extends React.PureComponent {
    static propTypes = SVGMathView.propTypes;
    static getPreserveAspectRatio = SVGMathView.getPreserveAspectRatio;
    static getInnerStyleSync = SVGMathView.getInnerStyleSync;
    static getInnerStyle = SVGMathView.getInnerStyle;

    render() {
        return (
            <Context.Consumer>
                {
                    (cacheManager) => {
                        return (
                            <SVGMathView
                                {...this.props}
                                ref={this.props.forwardedRef}
                                cacheManager={cacheManager}
                            />
                        );
                    }
                }
            </Context.Consumer>
        );
    }
}

const Exporter = React.forwardRef((props, forwardedRef) => <MathView {...props} forwardedRef={forwardedRef} />);
Exporter.propTypes = SVGMathView.propTypes;
Exporter.getPreserveAspectRatio = SVGMathView.getPreserveAspectRatio;
Exporter.getInnerStyleSync = SVGMathView.getInnerStyleSync;
Exporter.getInnerStyle = SVGMathView.getInnerStyle;

export default Exporter;