'use strict';
import React from 'react';

export class CacheHandler {
    warn = true;
    stub = () => {
        this.warn && console.warn('MathProvider: stubbed `CacheManager` method');
        return this;
    }
    getCache = this.stub;
    addToCache = this.stub;
    clearDatabase = this.stub;
    clearCache = this.stub;
    isCached = this.stub;
    enable = this.stub;
    disable = this.stub;
    disableWarnings() {
        this.warn = false;
        return this;
    }
    setMaxTimeout = this.stub;
    handleRequest = this.stub;
    fetch = this.stub;
}

export const CacheManager = new CacheHandler();

export function Provider(props) {
    return props.children;
}