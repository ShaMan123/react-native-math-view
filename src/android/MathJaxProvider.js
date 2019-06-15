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
import EventEmitter from 'events';

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
const eventEmitter = new EventEmitter();
eventEmitter.setMaxListeners(1000);

async function getMathJaxNative(math) {
    const request = Array.isArray(math) ? math : [math];
    await new Promise((resolve, reject) => {
        const callback = () => !_.isNil(viewTag) && resolve();
        callback();
        eventEmitter.once('provider', callback);
        setTimeout(() => {
            eventEmitter.removeListener('provider', callback);
            reject('timeout: Could not find MathJax.Provider');
        }, 5000);
    });
    try {
        const response = await ViewModule.getMathJax(viewTag, request);
        _.map(response, (data) => {
            _getMathJax.cache.set(data.math, Promise.resolve(data));
        });
        cacheHandler.setCache(response);
        return response;
    }
    catch (err) {
        console.error(err.message || err);
        return [];
    }
}

const _getMathJax = _.memoize(getMathJaxNative);

export async function getMathJax(math) {
    const isArr = Array.isArray(math);
    const arr = isArr ? math : [math];
    const fetchFromNative = _.filter(arr, (str) => !_getMathJax.cache.has(str));
    if (_.size(fetchFromNative) > 0) {
        const canResolve = () => !_.some(fetchFromNative, (str) => !_getMathJax.cache.has(str));
        await Promise.race([
            new Promise((resolve) => {
                if (cacheHandler.active && canResolve) resolve();
                eventEmitter.once('cache', () => canResolve() && resolve());
            }),
            getMathJaxNative(fetchFromNative)
        ]);
    }
    
    const response = await Promise.all(_.map(arr, _getMathJax));
    return isArr ? response : response[0];
}

class CacheHandler {
    active = false;
    cache = [];
    constructor() {
        this.appState = AppState.currentState;
        this.getCache();
    }

    async getCache() {
        if (AsyncStorage) {
            const response = await AsyncStorage.getItem(storageKey);
            if (!response) return;
            _.map(JSON.parse(response), (data) => {
                this.cache.push(data);
                _getMathJax.cache.set(data.math, Promise.resolve(data));
            });
            if (!this.active) {
                this.active = true;
                eventEmitter.emit('cache');
            }            
        }
    }

    async setCache(data) {
        if (AsyncStorage) {
            this.cache.push(...data);
            return AsyncStorage.setItem(storageKey, JSON.stringify(this.cache));
        }
    }

    clearCache() {
        this.cache = [];
        _getMathJax.cache.clear();
        return AsyncStorage.removeItem(storageKey);
    }

    isCached(key) {
        return _getMathJax.cache.has(key);
    }
}

export const cacheHandler = new CacheHandler();

export class Provider extends Component {
    static propTypes = {
        preload: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.string), PropTypes.string])
    }

    constructor(props) {
        super(props);
        props.preload && getMathJax(props.preload);
    }

    static getDerivedStateFormProps(nextProps) {
        getMathJax(nextProps.preload);
        return null;
    }

    _handleRef = (ref) => {
        viewTag = ref ? findNodeHandle(ref) : null;
        eventEmitter.emit('provider', viewTag);
    }

    preload(math) {
        return getMathJax(math);
    }

    clear() {
        return cacheHandler.clearCache();
    }

    render() {
        return (
            <RNMathJaxProvider
                ref={this._handleRef}
            />
        );
    }
}



