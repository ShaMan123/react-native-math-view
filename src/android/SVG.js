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

import { CacheManager } from './MathJaxProvider';

const nativeViewName = 'RNSVGMathView';
const RNMathView = requireNativeComponent(nativeViewName, SVGMathView, {
    nativeOnly: {
        nativeID: true
    }
});
const MathViewManager = NativeModules.RNMathViewManager || {};
export const { Constants } = UIManager.getViewManagerConfig ? UIManager.getViewManagerConfig(nativeViewName) : UIManager[nativeViewName];

const minDim = 35;
const padding = 10;

const styles = StyleSheet.create({
    base: {
        flex: 1,
        minHeight: minDim
    }
});

export default class SVGMathView extends Component {
    static propTypes = {
        cacheManager: PropTypes.any,
        resizeMode: PropTypes.oneOf(['center', 'contain', 'cover', 'stretch']),
        scaleToFit: PropTypes.bool,
        source: PropTypes.shape({
            svg: PropTypes.string,
            math: PropTypes.string
        }).isRequired,
        style: ViewPropTypes.style
    }
    static defaultProps = {
        resizeMode: 'center',
        scaleToFit: false,
        style: styles.base
    }
    
    static Constants = Constants;

    static getPreserveAspectRatio = (alignment, scale) => `${alignment} ${scale}`;

    ref = React.createRef();
    data = {};

    constructor(props) {
        super(props);
        const { width, height } = Dimensions.get('window');
        
        this.state = {
            maxWidth: width,
            maxHeight: height
        };
    }
   

    static getDerivedStateFromProps(nextProps, prevState) {
        if (!nextProps.scaleToFit) {
            const { width, height } = Dimensions.get('window');
            if (width !== prevState.maxWidth) return { maxWidth: width, maxHeight: height };
        }
        return null;
    }

    async componentDidMount() {
        await this.fetchAndUpdate();
    }

    async componentDidUpdate(prevProps, prevState) {
        if (!_.isEqual(prevProps.source, this.props.source)) {
            if (this.props.source.math) {
                this.fetchAndUpdate();
            }
            else {
                this.update(this.props.svg);
            }
        }
    }

    get innerStyle() {
        const { maxWidth, maxHeight } = this.state;
        return SVGMathView.getInnerStyleSync(this.data, { maxWidth, maxHeight, resizeMode: this.props.resizeMode });
    }

    static async getInnerStyle(math, layoutParams) {
        const layoutData = await CacheManager.fetch(math);
        return SVGMathView.getInnerStyle(layoutData, layoutParams);
    }

    static getInnerStyleSync(layoutData, { maxWidth, maxHeight, resizeMode }) {
        const contain = resizeMode === 'contain';
        const cover = resizeMode === 'cover';
        const stretch = resizeMode === 'stretch';
        const pow = contain ? -1 : 1;
        const minMax = contain || stretch ? Math.min : Math.max;
        const aWidth = stretch ? maxWidth : _.get(layoutData, 'apprxWidth', 0);
        let aHeight = _.get(layoutData, 'apprxHeight', 0);
        aHeight = stretch ? _.defaultTo(maxHeight, aHeight) : aHeight;
        const window = Dimensions.get('window');
        const scaleWidth = Math.min(Math.pow(window.width / (maxWidth - padding * 2), pow), 1);
        const scaleHeight = Math.min(Math.min(minDim / aHeight), 1);
        const scale = cover ? 1 : minMax(scaleWidth, scaleHeight);

        const width = aWidth * scale;
        const height = aHeight * scale;
        
        return {
            minWidth: minDim,
            minHeight: Math.max(height, minDim),
            flexBasis: Math.max(width, minDim),
            maxWidth: cover ? width : maxWidth - padding * 2,
            display: 'flex',
            elevation: 5,
            flexDirection: 'row'
        };
    }

    async fetchAndUpdate() {
        this.data = await this.props.cacheManager.fetch(this.props.source.math);
        //  change in time => check validity
        if (this.data && _.isEqual(this.data.math, this.props.source.math)) this.update(this.data.svg);
    }

    update(svg) {
        this.setNativeProps({ svg });
        this.forceUpdate();
    }

    setNativeProps(props) {
        this.ref.current && this.ref.current.setNativeProps(props);
    }

    _onLayout = (e) => {
        if (this.props.scaleToFit) this.setState({
            maxWidth: e.nativeEvent.layout.width,
            maxHeight: e.nativeEvent.layout.height
        });
    }

    render() {
        return (
            <>
                <View
                    style={StyleSheet.absoluteFill}
                    onLayout={this._onLayout}
                />
                <RNMathView
                    {...this.props}
                    style={[this.innerStyle, this.props.style]}
                    ref={this.ref}
                />
            </>
        );
    }
}



