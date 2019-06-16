
import React, {Component} from 'react';
import { Platform, StyleSheet, Text, View, TextInput, SectionList, FlatList, UIManager, Alert, Dimensions, ScrollView, YellowBox, Button, TouchableOpacity } from 'react-native';
import * as _ from 'lodash';
import MathView, { MathJaxProvider } from 'react-native-math-view';
import * as MathStrings from './math';

YellowBox.ignoreWarnings(['Warning: `flexWrap: `wrap`` is not supported with the `VirtualizedList` components.']);

const data = require('./tags.json');

const cachePreloadRequest = 'x=\frac{-b\pm\sqrt{b^2-4ac}}{2a}';

const numStates = 4;

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
            state: 2,
            tag: MathStrings.calculus.filter((obj) => obj.math)[0],
            mip: false,
            singleton: false
        }

        MathJaxProvider.CacheManager.setMaxTimeout(7000);
    }
    
    async componentDidMount() {
        let i = 0;
        const interval = 3000;
        const tags = MathStrings.calculus.filter((obj) => obj.math);
        setTimeout(async () => console.log('isCached', await MathJaxProvider.CacheManager.isCached(cachePreloadRequest)), 5000);
        this.t = setInterval(async () => {
            const tag = this.state.state === 3 ? _.set(this.state.tag, 'string', `\\frac{${this.state.tag.string}}{${i}}`) : tags[i % tags.length];
            const data = await MathJaxProvider.CacheManager.fetch(tag.string);
            
            this.setState({
                width: Math.min(Dimensions.get('window').width * (i % 4 + 1) * 0.25, Dimensions.get('window').width),
                tag: { ...tag, renderingData:data },
                mip: true
            });
            i++;
            //console.log('getMathJax1', await MathJaxProvider.CacheManager.fetch(tags[i % tags.length].string));
            //console.log('getMathJaxAll', await MathJaxProvider.CacheManager.fetch(tags.map(t => t.string)));
        }, interval);
    }

    componentWillUnmount() {
        clearInterval(this.t);
    }

    findData(math) {
        const tag = data.find((tag) => tag.math === math);
        if (!tag) return null;
        return tag.renderingData;
    }
    
    renderItem(item, props = {}) {
        const getColor = () => Math.round(Math.random() * 255);
        const getPixel = () => [getColor(), getColor(), getColor()].join(',');
        const parsedColor = () => `rgb(${getPixel()})`;
        //
        return (
            <TouchableOpacity style={[styles.flexContainer]}>
                <MathView
                    source={{ math: item.string }}
                    //style={{maxHeight: 20, maxWidth: 200}}
                    style={null}
                    color={parsedColor()}
                    scaleToFit
                    {...props}
                />
            </TouchableOpacity>
        );
    }

    renderStat(item) {
        return this.renderItem(item);
    }

    render3() {
        return this.render0();
    }
    
    render2() {
        return React.cloneElement(this.render1(), {
            style: {flex:1},
            contentContainerStyle: { flexWrap: 'wrap', display: 'flex', flexDirection: 'row' },
            renderSectionHeader: ({ section: { title } }) => (<Text style={[styles.sectionHeader,{ minWidth: Dimensions.get('window').width}]}>{title}</Text>),
            renderItem: ({ item }) => {
                const innerStyle = MathView.getInnerStyleSync(this.findData(item.string), { maxWidth: this.state.width, resizeMode: 'contain' });
                return React.cloneElement(this.renderItem(item, { style: innerStyle, resizeMode:'contain' }), { style: styles.flexWrapContainer });
            }
        });
    }
    
    render1() {
        return (
            <SectionList
                renderItem={({ item, index, section }) => this.renderStat(item)}
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
        return <View style={{ flex: 1, justifyContent:'center' }}>{this.renderItem(this.state.tag, { backgroundColor: 'blue', color: 'white' })}</View>;
    }

    get title() {
        const m = (this.state.state + 1) % numStates;
        switch (m) {
            case 0: return 'Stanalone View';
            case 1: return 'Flex SectionList';
            case 2: return 'FlexWrap SectionList';
            case 3: return 'Changing on the Fly';
        }
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <MathJaxProvider.Provider
                    preload={cachePreloadRequest}
                />
                <View style={{ flex: 1 }}>
                    {this[`render${this.state.state}`]()}
                </View>
                <Button
                    
                    //style={{bottom: 0}}
                    onPress={() => this.setState((prev) => {
                        return { state: (prev.state + 1) % numStates };
                    })}
                    title={`change to ${this.title}`}
                />
            </View>
        );
    }
}
    
const styles = StyleSheet.create({
    flexContainer: {
        //flex: 1,
        display: 'flex',
        flexDirection: 'row',
        //flexWrap: 'wrap',
        //justifyContent: 'center',
        //alignItems: 'center',
        margin: 5
        
    },
    flexWrapContainer: {
        display: 'flex',
        flexDirection: 'row',
        margin: 5,
        elevation: 2,
        paddingHorizontal: 5,
        backgroundColor: 'pink',
        borderRadius: 50
    },
    sectionHeader: {
        backgroundColor: 'blue',
        color: 'white',
        flex: 1,
        elevation: 5
    }
});
