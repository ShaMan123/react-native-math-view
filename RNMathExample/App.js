
import React, {Component} from 'react';
import { Platform, StyleSheet, Text, View, TextInput, SectionList, FlatList, UIManager, Alert, Dimensions, ScrollView, YellowBox, Button } from 'react-native';
import * as _ from 'lodash';
import MathView from 'react-native-math-view';
import * as MathStrings from './math';
import WebView from 'react-native-webview';

YellowBox.ignoreWarnings(['Warning: `flexWrap: `wrap`` is not supported with the `VirtualizedList` components.']);

const data = require('./tags.json');

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            refreshing: false,
            sections: [
                {
                    title: 'calculus',
                    data: MathStrings.calculus.filter((obj) => obj.math),
                    keyExtractor: (item) => `calculus:${item.string}`
                },
                {
                    title: 'trig',
                    data: MathStrings.trig.filter((obj) => obj.math),
                    keyExtractor: (item) => `trig:${item.string}`
                }
            ],
            width: Dimensions.get('window').width,
            fontScale: 1,
            state: 1,
            tag: MathStrings.calculus.filter((obj) => obj.math)[0],
            mip: false,
            singleton: false
        }
        
    }
    
    componentDidMount() {
        let i = 0;
        const interval = 5000;
        const tags = MathStrings.calculus.filter((obj) => obj.math);

        this.t = setInterval(() => {
            this.setState({
                width: Math.min(Dimensions.get('window').width * (i % 4 + 1) * 0.25, Dimensions.get('window').width),
                tag: tags[i % tags.length],
                mip: true
            });
            i++;
        }, interval);
    }

    componentWillUnmount() {
        clearInterval(this.t);
    }

    renderItem(item, props) {
        const tag = data.find((tag) => tag.math === item.string);
        if (!tag) return null;
        const svg = tag.renderingData.svg;
        console.log(svg)
        return (
            <View style={styles.flexContainer}>
                <MathView
                    //onLayout={e => console.log(item.string, e.nativeEvent.layout)}
                    {...props}
                    math={item.string}
                    svg={svg}
                />
            </View>
        );
    }

    render2() {
        return React.cloneElement(this.render1(), {
            style: {flex:1},
            contentContainerStyle: { flexWrap: 'wrap', display: 'flex', flexDirection: 'row' },
            renderSectionHeader: ({ section: { title } }) => (<Text style={[styles.sectionHeader,{ minWidth: Dimensions.get('window').width}]}>{title}</Text>),
            renderItem: ({ item }) => {
                return React.cloneElement(this.renderItem(item, { style: { flex: 1, minHeight: 35, flexBasis: this.state.width, maxWidth: Dimensions.get('window').width - 10 } }), { style: [styles.flexContainer,{margin:5}]});
            }
        });
    }
    
    render1() {
        return (
            <SectionList
                scrollEnabled
                renderItem={({ item, index, section }) => this.renderItem(item)}
                renderSectionHeader={({ section: { title } }) => <Text style={styles.sectionHeader}>{title}</Text>}
                sections={this.state.singleton ? [
                    {
                        title: 'calculus',
                        data: [this.state.sections[0].data[0]],
                        keyExtractor: (item) => `calculus:${item.string}`
                    }
                ] : this.state.sections}
                //sections={this.state.sections}
                onRefresh={() => {
                    this.setState({
                        sections: [
                            {
                                title: 'calculus',
                                data: this.state.sections[0].data.reverse(),
                                keyExtractor: (item) => `calculus:${item.string}`
                            },
                            {
                                title: 'trig',
                                data: this.state.sections[1].data.reverse(),
                                keyExtractor: (item) => `trig:${item.string}`
                            }
                        ]
                    })
                }}
                refreshing={this.state.refreshing}
                style={{ flex: 1, maxWidth: this.state.width }}
                //contentContainerStyle={{flex:1}}
                extraData={this.state.width}
            />
        );
    }

    render0() {
        return this.renderItem(this.state.tag);
    }

    get title() {
        const m = (this.state.state + 1) % 3;
        switch (m) {
            case 0: return 'Stanalone View';
            case 1: return 'Flex SectionList';
            case 2: return 'FlexWrap SectionList';
        }
    }

    postMessage(data) {
        if (!this.webView) return;
        this.webView.injectJavaScript(`(function(){window.postMessage(JSON.stringify(${JSON.stringify(data)}));true;}());`);
        //this.webView.injectJavaScript(`(function(){window.ReactNativeWebView.postMessage(JSON.stringify(${JSON.stringify(data)}));}());`);
    }

    tar(math) {
        this.webView.injectJavaScript(`(function(){window.MathJaxProvider(${JSON.stringify({ math: data.data[0] })});}());`);
        
        this.webView.injectJavaScript(`(function(){window.ReactNativeMathView.postMessage("${JSON.stringify({ math })}");}());`);
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <View>
                    <WebView
                        javaScriptEnabled
                        originWhiteList={['*']}
                        ref={ref => {
                            this.webView = ref;                            
                        }}
                        onLoadEnd={() => {
                            setTimeout(() => this.postMessage({
                                data: [
                                    'E = mc^2',
                                    'x^{199}',
                                    "S_{\\triangle }=\\frac{ab\\sin \\left(\\gamma \\right)}{2}",
                                    "\\cos \\left(x\\right)",
                                    "\\frac{a}{\\sin \\left(\\alpha \\right)}=\\frac{b}{\\sin \\left(\\beta \\right)}=\\frac{c}{\\sin \\left(\\gamma \\right)}=2R",
                                    "\\sin \\left(x\\right)",
                                    "\\tan \\left(x\\right)",
                                    "c^2=a^2+b^2-2ab\\cos \\left(\\gamma \\right)",
                                ],
                                options: {}
                            }),2000);
                        }}
                        cacheEnabled={false}
                        source={{ uri: 'file:///android_asset/index.html', baseUrl: 'file:///android_asset' }}
                        onMessage={(e) => console.log(JSON.parse(e.nativeEvent.data))}
                        onError={syntheticEvent => {
                            const { nativeEvent } = syntheticEvent;
                            console.warn('WebView error: ', nativeEvent);
                        }}
                        //style={{ display: 'none', width: 0, height: 0 }}
                    />
                </View>
                <View style={{ flex: 1 }}>
                    {this[`render${this.state.state}`]()}
                </View>
                <Button
                    //style={{bottom: 0}}
                    onPress={() => this.setState((prev) => {
                        return { state: (prev.state + 1) % 3 };
                    })}
                    title={`change to ${this.title}`}
                />
            </View>
        );
    }
}
    
const styles = StyleSheet.create({
    flexContainer: {
        flex: 1,
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
        alignItems: 'center',
        
    },
    sectionHeader: {
        backgroundColor: 'blue', color: 'white', flex: 1
    }
});
