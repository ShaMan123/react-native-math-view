'use strict';
import React from 'react';

export class CacheHandler {

}

export const CacheManager = new CacheHandler();

export function Provider(props) {
    return this.props.children;
}