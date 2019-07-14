'use strict';
import React from 'react';
import { Provider } from './MathProvider';
import * as _ from 'lodash';

const providerProps = ['preload', 'useGlobalCacheManager'];

export default function MathProviderHOC(WrappedComponent, props = {}) {
    return class MathProviderHOC extends React.PureComponent {
        render() {
            return (
                <Provider
                    {...this.props}
                >
                    <WrappedComponent
                        {..._.omit(_.assign({}, this.props, props), ...providerProps)}
                    />
                </Provider>
            );
        }
    };
}