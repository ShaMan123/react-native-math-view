'use strict';

import React, { Component } from 'react';
//import PropTypes from 'prop-types';
import ReactNative, {
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
import memoize from 'lodash/memoize';
import mathJax from 'mathjax-node';

mathJax.config({
    MathJax: {
        // traditional MathJax configuration
    }
});
mathJax.start();

var yourMath = 'E = mc^2';


export default class MathViewBase extends Component {
    static propTypes = {
        //math: PropTypes.string.isRequired,
    }
    
    static pasreMath(math) {
        return `\\(${math.replace(/\\\\/g, '\\')}\\)`;
    }

    state = {
        uri: null,
        width: 0
    }

    async componentDidMount() {
        const data = await this.getBase64();
        console.log(data);
        this.setState({ uri: data.png, width: data.pngWidth });
    }

    getBase64(math = this.math) {
        return new Promise((resolve, reject) => {
            mathJax.typeset({
                math: math,
                format: "TeX", // or "inline-TeX", "MathML"
                svg: true,      // or svg:true, or html:true
                png: true
            }, function (data) {
                return data.errors ? reject(data) : resolve(data);
            });
        });
    }

    get math() {
        return MathViewBase.pasreMath(this.props.math);
    }

    onLayout = (e) => {
        const { onLayout } = this.props;
        const { size } = this.state;
        onLayout && size && onLayout(e);
    }

    render() {
        const { uri, width } = this.state;
        if(!uri) return null
        return (
            <Image
                //{...this.props}
                source={{ uri }}
                style={{width,height:50}}
                //style={[this.props.style, styles.base, size]}
                onLayout={this.onLayout}
            />
        );
    }
}

const styles = StyleSheet.create({
    base: {
        alignItems: 'center', justifyContent: 'center', display: 'flex'
    }
});

