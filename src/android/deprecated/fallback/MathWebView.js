'use strict';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    Text,
    View,
    ScrollView,
    WebView,
    StyleSheet,
    Platform,
    Dimensions,
    TouchableOpacity,
    ViewPropTypes
} from 'react-native';

import AutoHeightWebView from 'react-native-autoheight-webview';
import katex from './katex/katex';
import katexCSS from './katex/katexCSS';

//  https://github.com/Khan/KaTeX

/*
 * 
 * 
 * 
<MathWebView
                text={`\\(${name}\\)`}
                value={name}
                fallback={name}
                //webViewStyle={[{ padding: 35 }]}
                containerStyle={[styles.tag, styles.tagContainer, style]}
                onPress={onPress}
                textColor={textColor}
                //fontSize={fontSize}
                //padding={padding}
                onFullMount={({ width, height }) => {
                    this.setState({ fullMount: true })
                    console.log('fullyMounted', name, width, height)
                    //tagLib().mergeData(tagKey, { width, height });
                }}
            />
 * 
 * 
 * 
 * */

export default class MathWebView extends Component {
    static propTypes = {
        value: PropTypes.string.isRequired,
        fallback: PropTypes.string,
        style: ViewPropTypes.style,
        textColor: PropTypes.string,
        fontSize: PropTypes.oneOf(['xx-small', 'x-small', 'small', 'smaller', 'medium', 'large', 'larger', 'x-large', 'xx-large', '-webkit-xxx-large']),
        padding: PropTypes.number,
        onFullMount: PropTypes.func
        /*
        webViewStyle: PropTypes.shape({
            textColor: PropTypes.string,
            fontSize: PropTypes.oneOf(['xx-small', 'x-small', 'small', 'smaller', 'medium', 'large', 'larger', 'x-large', 'xx-large', '-webkit-xxx-large']),
            padding: PropTypes.number
        }),
        */
    }
    static defaultProps = {
        textColor: '#fff',
        fontSize: 'small',
        padding: 20
    };

    constructor(props) {
        super(props);

        this.onFullMount = props.onFullMount;
        this.bodyStyle = `
            body {
                color: ${props.textColor};
                font-size: ${props.fontSize};
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .container {
                padding: 0 10px;
            }
        `;
        this.animationDuration = 255;

        this.state = {
            display: false,
            value: props.value,
            htmlString: this.getHTMLString(props.value),
            useFallback: false
        }
    }

    getHTMLString(value) {
        const innerHTML = katex.renderToString(value);
        return `<span class="container">${innerHTML}</span>`;
    }

    static getDerivedStateFromProps(newProps, prevState) {
        const { value } = newProps;
        if (value !== prevState.value) {
            return {
                value,
                htmlString: this.getHTMLString(value)
            }
        }
        else {
            return null;
        }
    }

    componentDidUpdate() {
        const { width, height, display } = this.state;
        if (display && this.onFullMount) {
            this.onFullMount({ width, height });
            delete this.onFullMount;
        }
    }

    render() {
        const { display, height, width, htmlString, useFallback } = this.state;
        var { fallback, style, padding, onPress } = this.props;
        const viewStyle = [styles._container, style];
        const containerStyle = [styles.view];       

        if (!display) {
            viewStyle.push(styles._invisible);
        }
        else if (height && width) {
            containerStyle.push({ height, width });
            viewStyle.push({ height: height + padding, width: width + padding });
        }

        if (useFallback) {
            try {
                return (
                    <View style={viewStyle}>
                        <View style={containerStyle}>
                            <TouchableOpacity onPress={onPress}>
                                <AutoHeightWebView
                                    //shouldResizeWidth
                                    onSizeUpdated={({ height, width }) => this.setState({ display: true, height, width })}
                                    //onSizeUpdated={({height, width}) => console.log(`onSizeUpdated height: ${height}, width: ${width}`)}

                                    onError={(e) => { this.setState({ useFallback: true }) }}

                                    hasIframe={false}

                                    //if set to false may cause some layout issues (width of container not fit for screen) on android
                                    //if set to true may cause some layout issues (smaller font size) on iOS

                                    scalesPageToFit={Platform.OS === 'android' ? true : false}
                                    enableBaseUrl={true}
                                    style={styles.webView}

                                    // enable animation by default
                                    enableAnimation={true}
                                    animationDuration={this.animationDuration}
                                    source={{ html: htmlString, baseUrl: '' }}
                                    customStyle={`${katexCSS}${this.bodyStyle}`}
                                    /*
                                    files={[{
                                        href: Platform.select({
                                            android: 'file:///android_asset/web/katex.css',
                                            ios: ''
                                        }),
                                        type: 'text/css',
                                        rel: 'stylesheet'
                                    }]}
                                    */
                                    // only on iOS
                                    onShouldStartLoadWithRequest={result => {
                                        //console.log(result)
                                        return true;
                                    }}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                );
            }
            catch (err) {
                this.setState({ useFallback: true });
            }
        }
        else {
            if (fallback) {
                return <Text>{fallback}</Text>
            }
            else {
                //throw new Error('fallback value unspecified');
                return null;
            }
        }
    }
}

function getHTMLString(innerHTML) {
    return `<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
            <head>
                <meta charset="utf-8" />
                <title></title>
                <!--
                    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.10.0-alpha/dist/katex.min.css" integrity="sha384-BTL0nVi8DnMrNdMQZG1Ww6yasK9ZGnUxL1ZWukXQ7fygA1py52yPp9W4wrR00VML" crossorigin="anonymous">
                    OR
                <style>
                    ${katexCSS}
                </style>
                -->
                <style>
                    ${katexCSS}
                </style>
                
            </head>
            <body>
                <span class="container">
                                ${innerHTML}
                </span>
            </body>
            </html>`;
}

const styles = StyleSheet.create({
    view: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    _container: {
        //maxWidth: Dimensions.get('window').width - 15,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    _invisible: {
        opacity: 0
    },
    webView: {
        // default width is the width of screen
        // if there are some text selection issues on iOS, the width should be reduced more than 15 and the marginTop should be added more than 35
        // width: Dimensions.get('window').width - 15, marginTop: 35
        //flex: 1
    }
});