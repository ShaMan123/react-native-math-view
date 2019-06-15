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

import { getMathJax } from './MathJaxProvider';

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
        source: PropTypes.shape({
            svg: PropTypes.string,
            math: PropTypes.string
        }).isRequired,
        style: ViewPropTypes.style
    }
    static defaultProps = {
        style: styles.base
    }
    
    static Constants = Constants;

    static getPreserveAspectRatio = (alignment, scale) => `${alignment} ${scale}`;

    ref = React.createRef();
    data = {};

    async componentDidMount() {
        this.data = await getMathJax(this.props.source.math);
        this.update(this.data.svg);
    }

    async componentDidUpdate(prevProps, prevState) {
        if (!_.isEqual(prevProps.source, this.props.source)) {
            if (this.props.source.math) {
                this.data = await getMathJax(this.props.source.math);
                this.update(this.data.svg);
            }
            else {
                this.update(this.props.svg);
            }
        }
    }

    get innerStyle() {
        const window = Dimensions.get('window');
        const aWidth = _.get(this.data, 'apprxWidth', 0);
        const aHeight = _.get(this.data, 'apprxHeight', 0);
        const scaleWidth = Math.min(window.width / (window.width - padding * 2), 1);
        const scaleHeight = Math.min(Math.min(minDim / aHeight), 1);
        const scale = Math.min(scaleWidth, scaleHeight);

        const width = aWidth * scale;
        const height = aHeight * scale;

        return {
            minWidth: minDim,
            minHeight: minDim,  //Math.max(height, minDim),
            flexBasis: Math.max(width, minDim),
            maxWidth: window.width - padding * 2,
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

    render() {
        return (
            <RNMathView
                {...this.props}
                style={[this.innerStyle, this.props.style]}
                ref={this.ref}
            />
        );
    }
}



