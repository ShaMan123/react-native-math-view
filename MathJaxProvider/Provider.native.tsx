import * as React from 'react';
import { View } from 'react-native';
import * as _ from 'lodash';
import WebView from 'react-native-webview';
import AsyncStorage from '@react-native-community/async-storage';
import EventEmitter from 'events';

const m = [
    'E = mc^2',
    'x^{199}',
    "S_{\\triangle }=\\frac{ab\\sin \\left(\\gamma \\right)}{2}",
    "\\cos \\left(x\\right)",
    "\\frac{a}{\\sin \\left(\\alpha \\right)}=\\frac{b}{\\sin \\left(\\beta \\right)}=\\frac{c}{\\sin \\left(\\gamma \\right)}=2R",
    "\\sin \\left(x\\right)",
    "\\tan \\left(x\\right)",
    "c^2=a^2+b^2-2ab\\cos \\left(\\gamma \\right)",
]

class Provider extends React.Component {
    webView: WebView;

    postMessage(message: { data: string[], options?: object }) {
        if (!this.webView) return;
        _.defaultsDeep(message, { options: {} });
        this.webView.injectJavaScript(`(function(){window.postMessage(JSON.stringify(${JSON.stringify(message)}));true;}());`);
    }

    onLoadEnd = () => {
        setTimeout(() => this.postMessage({ data: m }), 2000);
    }

    _handleRef = (ref: WebView | null) => (this.webView = ref);

    _onMessage = (e: any) => {
        console.log(JSON.parse(e.nativeEvent.data))
    }

    render() {
        return (
            <View>
                <WebView
                    javaScriptEnabled
                    originWhiteList={['*']}
                    ref={this._handleRef}
                    onLoadEnd={this.onLoadEnd}
                    cacheEnabled={false}
                    source={{ uri: 'file:///android_asset/index.html', baseUrl: 'file:///android_asset' }}
                    onMessage={this._onMessage}
                />
            </View>
        );
    }
}