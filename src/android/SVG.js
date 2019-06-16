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
        resizeMode: PropTypes.oneOf(['contain', 'cover']),
        scaleToFit: PropTypes.bool,
        source: PropTypes.shape({
            svg: PropTypes.string,
            math: PropTypes.string
        }).isRequired,
        style: ViewPropTypes.style
    }
    static defaultProps = {
        resizeMode: 'cover',
        scaleToFit: false,
        style: styles.base
    }
    
    static Constants = Constants;

    static getPreserveAspectRatio = (alignment, scale) => `${alignment} ${scale}`;

    ref = React.createRef();
    data = {};
    state = {
        maxWidth: Dimensions.get('window').width
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (!nextProps.scaleToFit) {
            const width = Dimensions.get('window').width;
            if (width !== prevState.maxWidth) return { maxWidth: width };
        }
        return null;
    }

    async componentDidMount() {
        this.data = await CacheManager.fetch(this.props.source.math);
        this.update(this.data.svg);
    }

    async componentDidUpdate(prevProps, prevState) {
        if (!_.isEqual(prevProps.source, this.props.source)) {
            if (this.props.source.math) {
                this.data = await CacheManager.fetch(this.props.source.math);
                this.update(this.data.svg);
            }
            else {
                this.update(this.props.svg);
            }
        }
    }

    get innerStyle() {
        const { maxWidth } = this.state;
        return SVGMathView.getInnerStyleSync(this.data, { maxWidth, resizeMode: this.props.resizeMode });
    }

    static async getInnerStyle(math, layoutParams) {
        const layoutData = await CacheManager.fetch(math);
        return SVGMathView.getInnerStyle(layoutData, layoutParams);
    }

    static getInnerStyleSync(layoutData, { maxWidth, resizeMode }) {
        const contain = resizeMode === 'contain';
        const pow = contain ? -1 : 1;
        const minMax = contain ? Math.min : Math.max;
        const aWidth = _.get(layoutData, 'apprxWidth', 0);
        const aHeight = _.get(layoutData, 'apprxHeight', 0);
        const window = Dimensions.get('window');
        const scaleWidth = Math.min(Math.pow(window.width / (maxWidth - padding * 2), pow), 1);
        const scaleHeight = Math.min(Math.min(minDim / aHeight), 1);
        const scale = minMax(scaleWidth, scaleHeight);

        const width = aWidth * scale;
        const height = aHeight * scale;

        return {
            minWidth: minDim,
            minHeight: Math.max(height, minDim),
            flexBasis: Math.max(width, minDim),
            maxWidth: maxWidth - padding * 2,
            display: 'flex',
            elevation: 5
        };
    }

    update(svg) {
        this.setNativeProps({ svg });
        this.forceUpdate();
    }

    setNativeProps(props) {
        this.ref.current && this.ref.current.setNativeProps(props);
    }

    _onLayout = (e) => {
        if(this.props.scaleToFit) this.setState({ maxWidth: e.nativeEvent.layout.width });
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



