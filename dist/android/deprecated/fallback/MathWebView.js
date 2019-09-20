'use strict';
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Text, View, StyleSheet, Platform, TouchableOpacity, ViewPropTypes } from 'react-native';
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
var MathWebView = /** @class */ (function (_super) {
    __extends(MathWebView, _super);
    function MathWebView(props) {
        var _this = _super.call(this, props) || this;
        _this.onFullMount = props.onFullMount;
        _this.bodyStyle = "\n            body {\n                color: " + props.textColor + ";\n                font-size: " + props.fontSize + ";\n                display: flex;\n                align-items: center;\n                justify-content: center;\n            }\n            .container {\n                padding: 0 10px;\n            }\n        ";
        _this.animationDuration = 255;
        _this.state = {
            display: false,
            value: props.value,
            htmlString: _this.getHTMLString(props.value),
            useFallback: false
        };
        return _this;
    }
    MathWebView.prototype.getHTMLString = function (value) {
        var innerHTML = katex.renderToString(value);
        return "<span class=\"container\">" + innerHTML + "</span>";
    };
    MathWebView.getDerivedStateFromProps = function (newProps, prevState) {
        var value = newProps.value;
        if (value !== prevState.value) {
            return {
                value: value,
                htmlString: this.getHTMLString(value)
            };
        }
        else {
            return null;
        }
    };
    MathWebView.prototype.componentDidUpdate = function () {
        var _a = this.state, width = _a.width, height = _a.height, display = _a.display;
        if (display && this.onFullMount) {
            this.onFullMount({ width: width, height: height });
            delete this.onFullMount;
        }
    };
    MathWebView.prototype.render = function () {
        var _this = this;
        var _a = this.state, display = _a.display, height = _a.height, width = _a.width, htmlString = _a.htmlString, useFallback = _a.useFallback;
        var _b = this.props, fallback = _b.fallback, style = _b.style, padding = _b.padding, onPress = _b.onPress;
        var viewStyle = [styles._container, style];
        var containerStyle = [styles.view];
        if (!display) {
            viewStyle.push(styles._invisible);
        }
        else if (height && width) {
            containerStyle.push({ height: height, width: width });
            viewStyle.push({ height: height + padding, width: width + padding });
        }
        if (useFallback) {
            try {
                return (React.createElement(View, { style: viewStyle },
                    React.createElement(View, { style: containerStyle },
                        React.createElement(TouchableOpacity, { onPress: onPress },
                            React.createElement(AutoHeightWebView
                            //shouldResizeWidth
                            , { 
                                //shouldResizeWidth
                                onSizeUpdated: function (_a) {
                                    var height = _a.height, width = _a.width;
                                    return _this.setState({ display: true, height: height, width: width });
                                }, 
                                //onSizeUpdated={({height, width}) => console.log(`onSizeUpdated height: ${height}, width: ${width}`)}
                                onError: function (e) { _this.setState({ useFallback: true }); }, hasIframe: false, 
                                //if set to false may cause some layout issues (width of container not fit for screen) on android
                                //if set to true may cause some layout issues (smaller font size) on iOS
                                scalesPageToFit: Platform.OS === 'android' ? true : false, enableBaseUrl: true, style: styles.webView, 
                                // enable animation by default
                                enableAnimation: true, animationDuration: this.animationDuration, source: { html: htmlString, baseUrl: '' }, customStyle: "" + katexCSS + this.bodyStyle, 
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
                                onShouldStartLoadWithRequest: function (result) {
                                    //console.log(result)
                                    return true;
                                } })))));
            }
            catch (err) {
                this.setState({ useFallback: true });
            }
        }
        else {
            if (fallback) {
                return React.createElement(Text, null, fallback);
            }
            else {
                //throw new Error('fallback value unspecified');
                return null;
            }
        }
    };
    MathWebView.propTypes = {
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
    };
    MathWebView.defaultProps = {
        textColor: '#fff',
        fontSize: 'small',
        padding: 20
    };
    return MathWebView;
}(Component));
export default MathWebView;
function getHTMLString(innerHTML) {
    return "<html lang=\"en\" xmlns=\"http://www.w3.org/1999/xhtml\">\n            <head>\n                <meta charset=\"utf-8\" />\n                <title></title>\n                <!--\n                    <link rel=\"stylesheet\" href=\"https://cdn.jsdelivr.net/npm/katex@0.10.0-alpha/dist/katex.min.css\" integrity=\"sha384-BTL0nVi8DnMrNdMQZG1Ww6yasK9ZGnUxL1ZWukXQ7fygA1py52yPp9W4wrR00VML\" crossorigin=\"anonymous\">\n                    OR\n                <style>\n                    " + katexCSS + "\n                </style>\n                -->\n                <style>\n                    " + katexCSS + "\n                </style>\n                \n            </head>\n            <body>\n                <span class=\"container\">\n                                " + innerHTML + "\n                </span>\n            </body>\n            </html>";
}
var styles = StyleSheet.create({
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
//# sourceMappingURL=MathWebView.js.map