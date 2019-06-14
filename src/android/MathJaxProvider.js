'use strict';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    requireNativeComponent,
    NativeModules,
    UIManager,
    PixelRatio,
    Platform,
    ViewPropTypes,
    processColor,
    Dimensions,
    Animated,
    View,
    StyleSheet,
    findNodeHandle
} from 'react-native';
import * as _ from 'lodash';

const nativeViewName = 'RNMathJaxProvider';
const RNMathJaxProvider = requireNativeComponent(nativeViewName, Provider, {
    nativeOnly: {
        nativeID: true
    }
});
const ViewManager = NativeModules.RNMathViewManager || {};
export const { Constants } = UIManager.getViewManagerConfig ? UIManager.getViewManagerConfig(nativeViewName) : UIManager[nativeViewName];
const ViewModule = Platform.OS === 'ios' ? ViewManager : NativeModules.RNMathViewModule;

let viewTag = null;

function getMathJaxNative(math) {
    return ViewModule.getMathJax(viewTag, math);
}

export const getMathJax = _.memoize(getMathJaxNative);

export class Provider extends Component {
    _handleRef = (ref) => {
        viewTag = ref ? findNodeHandle(ref) : null;
    }

    render() {
        return (
            <RNMathJaxProvider
                ref={this._handleRef}
            />
        );
    }
}



