'use strict';
import React from 'react';

export class CacheHandler {
    warnings = true;
    stub = () => { this.warnings && console.warn('MathProvider: stubbed `CacheManager` method'); }
    getCache = this.stub;
    addToCache = this.stub;
    clearDatabase = this.stub;
    clearCache = this.stub;
    isCached = this.stub;
    enable = this.stub;
    disable = this.stub;
    disableWarnings() {
        this.warnings = false;
    }
    setMaxTimeout = this.stub;
    handleRequest = this.stub;
    fetch = this.stub;
}

export const CacheManager = new CacheHandler();

export function Provider(props) {
    return props.children;
}