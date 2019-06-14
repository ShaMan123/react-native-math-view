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
    findNodeHandle,
    AppState
} from 'react-native';
import * as _ from 'lodash';
import AsyncStorage from '@react-native-community/async-storage';

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
const storageKey = 'MathJaxProviderCache';
const result = [];

async function getMathJaxNative(math) {
    const response = await ViewModule.getMathJax(viewTag, math);
    _.map(response, (data) => {
        _getMathJax.cache.set(data.math, Promise.resolve(data));
    });
    result.push(...response);
}

const _getMathJax = _.memoize(getMathJaxNative);

export async function getMathJax(math) {
    const isArr = Array.isArray(math);
    const arr = isArr ? math : [math];
    const fetchFromNative = _.filter(arr, (str) => !_getMathJax.cache.has(str));
    if (_.size(fetchFromNative) > 0) await getMathJaxNative(fetchFromNative);
    const response = await Promise.all(_.map(arr, _getMathJax));
    return isArr ? response : response[0];
}

class CacheHandler {
    constructor() {
        this.appState = AppState.currentState;
        AppState.addEventListener('change', this.listener);
        this.getCache();
    }

    listener = (nextAppState) => {
        if (nextAppState.match(/inactive|background/)) {
            this.setCache();
        }
        else {
            this.getCache();
        }
        this.appState = nextAppState;
    }

    destroy() {
        AppState.removeEventListener('change', this.listener);
    }

    async getCache() {
        if (AsyncStorage) {
            const response = await AsyncStorage.getItem(storageKey);
            if (!response) return;
            _.map(JSON.parse(response), (data) => {
                _getMathJax.cache.set(data.math, Promise.resolve(data));
            });
        }
    }

    setCache() {
        if (AsyncStorage) AsyncStorage.setItem(storageKey, JSON.stringify(result));
    }
}

const cacheHandler = new CacheHandler();

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



