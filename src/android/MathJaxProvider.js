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

class CacheHandler {
    active = false;
    cache = [];
    maxTimeout = 10000;
    storageKey = 'MathJaxProviderCache';
    viewTag = null;
    eventEmitter = new EventEmitter();

    constructor() {
        this.appState = AppState.currentState;
        this.eventEmitter.setMaxListeners(1000);
        this.getCache();
    }

    async getCache() {
        if (AsyncStorage) {
            const response = await AsyncStorage.getItem(this.storageKey);
            if (!response) return;
            _.map(JSON.parse(response), (data) => {
                this.cache.push(data);
                this.requestMem.cache.set(data.math, Promise.resolve(data));
            });
            if (!this.active) {
                this.active = true;
                this.eventEmitter.emit('cache');
            }            
        }
    }

    async setCache(data) {
        if (AsyncStorage) {
            const response = _.filter(data, (val) => _.has(val, 'svg'));
            this.cache.push(...response);
            _.map(response, (val) => this.requestMem.cache.set(val.math, Promise.resolve(val)));
            return AsyncStorage.setItem(this.storageKey, JSON.stringify(this.cache));
        }
    }

    clearCache() {
        this.cache = [];
        this.requestMem.cache.clear();
        return AsyncStorage.removeItem(this.storageKey);
    }

    isCached(key) {
        return this.requestMem.cache.has(key);
    }

    setMaxTimeout(timeout) {
        this.maxTimeout = timeout;
    }

    requestMem = _.memoize(this.handleRequest.bind(this));

    async handleRequest(math, timeout = this.maxTimeout) {
        const request = Array.isArray(math) ? math : [math];
        await new Promise((resolve, reject) => {
            const callback = () => !_.isNil(this.viewTag) && resolve();
            callback();
            this.eventEmitter.once('provider', callback);
            setTimeout(() => {
                this.eventEmitter.removeListener('provider', callback);
                reject('timeout: Could not find MathJax.Provider');
            }, timeout);
        });
        try {
            const response = await ViewModule.getMathJax(this.viewTag, request, { timeout });
            this.setCache(response);
            return response;
        }
        catch (err) {
            console.error(err.message || err);
            return [];
        }
    }

    async fetch(math, timeout = this.maxTimeout) {
        const isArr = Array.isArray(math);
        const arr = isArr ? math : [math];
        const fetchFromNative = _.filter(arr, (str) => !this.requestMem.cache.has(str));
        if (_.size(fetchFromNative) > 0) {
            const canResolve = () => !_.some(fetchFromNative, (str) => !this.requestMem.cache.has(str));
            await Promise.race([
                new Promise((resolve) => {
                    if (this.active && canResolve) resolve();
                    this.eventEmitter.once('cache', () => canResolve() && resolve());
                }),
                this.handleRequest(fetchFromNative, timeout)
            ]);
        }

        const response = await Promise.all(_.map(arr, this.requestMem.bind(this)));
        return isArr ? response : response[0];
    }
}

export const CacheManager = new CacheHandler();

export class Provider extends Component {
    static propTypes = {
        preload: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.string), PropTypes.string])
    }

    constructor(props) {
        super(props);
        props.preload && CacheManager.fetch(props.preload);
    }

    static getDerivedStateFormProps(nextProps) {
        CacheManager.fetch(nextProps.preload);
        return null;
    }

    _handleRef = (ref) => {
        CacheManager.viewTag = ref ? findNodeHandle(ref) : null;
        CacheManager.eventEmitter.emit('provider', CacheManager.viewTag);
    }

    preload(math) {
        return CacheManager.fetch(math);
    }

    clear() {
        return CacheManager.clearCache();
    }

    getCacheManager() {
        return CacheManager;
    }

    render() {
        return (
            <RNMathJaxProvider
                ref={this._handleRef}
            />
        );
    }
}



