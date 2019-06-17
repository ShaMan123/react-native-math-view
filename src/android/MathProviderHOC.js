'use strict';
import React from 'react';
import { Provider } from './MathProvider';

export default function MathProviderHOC(WrappedComponent, preloadMath) {
    return class MathProviderHOC extends React.PureComponent {
        render() {
            return (
                <Provider
                    preload={preloadMath}
                >
                    <WrappedComponent />
                </Provider>
            );
        }
    };
}