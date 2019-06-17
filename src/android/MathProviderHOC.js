'use strict';
import React from 'react';
import { Provider } from './MathProvider';

export default function MathProviderHOC(WrappedComponent, props = {}) {
    return class MathProviderHOC extends React.PureComponent {
        render() {
            return (
                <Provider
                    {...this.props}
                >
                    <WrappedComponent />
                </Provider>
            );
        }
    };
}