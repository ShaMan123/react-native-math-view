
import * as _ from 'lodash';
import React, { Component } from 'react';
import { Button, Dimensions, ScrollView, SectionList, StyleSheet, Text, TouchableOpacity, View, YellowBox } from 'react-native';
import MathView, { MathProvider, useCalculatedStyle } from 'react-native-math-view';
import * as MathStrings from './math';
import data from './tags';
import { SvgXml } from 'react-native-svg';
import { SvgFromXml } from './rnsvg'

YellowBox.ignoreWarnings(['Warning: `flexWrap: `wrap`` is not supported with the `VirtualizedList` components.']);

const mathO = _.values({ ...MathStrings.calculus, ...MathStrings.trig }).filter((obj) => obj.math);
const cacheMirror = _.filter(data, o => _.has(o, 'renderingData')).map(o => ({ ...o.renderingData, math: o.math }));


const chem = `\\documentclass{article}
\\usepackage[version = 3]{ mhchem }
\\begin{ document }
\\noindent IUPAC recommendation: \\\\
\\ce{ 2H + (aq) + CO3 ^ { 2-}(aq) -> CO2(g) + H2O(l) }

\\bigskip

\\noindent Subscript: \\\\
\\ce{ 2H + {}_{ (aq) } + CO3 ^ { 2-}{ } _{ (aq) } -> CO2{ } _{ (g) } + H2O{ } _{ (l) } }
\\end{ document }`;

const pip = 'x_{1,2}=\\frac{-b\\pm\\sqrt{b^2-4ac}}{2a}';
//const cachePreloadRequest = ['x=\\frac{-b\\pm\\sqrt{b^2-4ac}}{2a}', ...mathO.map(o => o.string)];

const numStates = 4;

const interval = 3000;

function MathItem(props) {
    const getColor = () => Math.round(Math.random() * 255);
    const getPixel = () => [getColor(), getColor(), getColor()].join(',');
    const parsedColor = () => `rgb(${getPixel()})`;
    //
    return (
        <TouchableOpacity
            style={props.containerStyle}
        >
            <MathView
                //style={{maxHeight: 20, maxWidth: 200}}
                color={parsedColor()}
                scaleToFit
                resizeMode='contain'
                {...props}
            />
        </TouchableOpacity>
    );
}



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
            state: 2,
            tag: MathStrings.calculus.filter((obj) => obj.math)[0],
            singleton: false,
            i: 0
        };
        
    }
    
    async componentDidMount() {
        const tags = MathStrings.calculus.filter((obj) => obj.math);
        this.t = setInterval(async () => {
            let i = (this.state.i + 1) % 20;

            const tag = tags[i % tags.length];
            //const data = await MathProvider.CacheManager.fetch(tag.string);
            
            this.setState({
                i,
                //width: Math.min(Dimensions.get('window').width * (i % 4 + 1) * 0.25, Dimensions.get('window').width),
                tag,
            });
            //console.log('getMathJax1', await MathProvider.CacheManager.fetch(tags[i % tags.length].string));
            //console.log('getMathJaxAll', await MathProvider.CacheManager.fetch(tags.map(t => t.string)));
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

    getTaylor() {
        const exp = new Array(this.state.i + 1).fill(0).map((val, index) => index + 2);
        const rest = exp.map((val) => `{\\frac {x^{${val}}}{${val}!}}`).join('+');
        return `{\\displaystyle e^{x}=\\sum _{n=0}^{\\infty }{\\frac {x^{n}}{n!}}=1+x+${rest}+\\cdots }`;
    }

    getFrac(a, b) {
        return `\\frac{${a}}{${b}}`;
    }

    getRecursiveFrac() {
        const a = new Array(this.state.i + 1).fill(0);
        return a.reduce((acc, val, index) => this.getFrac(acc, index + 1), `x^{${this.state.i + 1}}`)
    }

    render3() {
        const taylor = this.getTaylor();
        const rFrac = this.getRecursiveFrac();
        console.log(rFrac)
        const i = this.state.i + 1;
        const frac = this.getFrac(`x+${i}`, i);
        
        return (
            <View
                style={{ flex: 1 }}
                //ref={ref => ref && ref.getCacheManager().disableWarnings()}
                useGlobalCacheManager={false}
                componentId='testId'
            >
                <ScrollView style={{ flex: 1 }}>
                    <View
                        //preload={cachePreloadRequest}
                        style={{ flex: 1 }}
                        //ref={ref => ref && ref.getCacheManager().disableWarnings()}
                        useGlobalCacheManager={false}
                    >
                        <Text>resizeMode: 'contain'</Text>
                        <MathItem
                            math={taylor}
                            backgroundColor='blue'
                            color='white'
                            scaleToFit={true}
                            resizeMode='contain'
                        />
                    </View>
                    <Text>resizeMode: 'center'</Text>
                    <MathItem
                        math={taylor}
                        backgroundColor='blue'
                        color='white'
                        scaleToFit={false}
                        resizeMode='center'
                    />
                    <Text>resizeMode: 'cover'</Text>
                    <View>
                        <ScrollView
                            horizontal
                            style={{ flexDirection: 'column' }}
                            scrollEnabled
                        //onScroll={e => console.log(e.nativeEvent)}
                        >
                            <MathItem
                                math={taylor}
                                backgroundColor='blue'
                                color='white'
                                scaleToFit={false}
                                resizeMode='cover'
                            />
                        </ScrollView>
                    </View>
                    <Text>resizeMode: 'stretch'</Text>
                    <MathItem
                        math={taylor}
                        backgroundColor='blue'
                        color='white'
                        scaleToFit
                        resizeMode='stretch'
                        style={{ minHeight: 150, flex: 1 }}
                    />
                    <View style={{ width: 200, height: 200, justifyContent: 'center', alignItems: 'stretch', borderColor: 'pink', borderWidth: 2, borderStyle: 'dashed', margin: 5 }} collapsable={false}>
                        <MathItem
                            math={frac}
                            backgroundColor='blue'
                            color='white'
                            resizeMode='stretch'
                        />
                    </View>
                    <Text>resizeMode: 'contain'</Text>
                    <MathItem
                        math={rFrac}
                        backgroundColor='blue'
                        color='white'
                        scaleToFit
                        resizeMode='contain'
                        config={{ex: 50, em:200, }}
                    />
                    <Text>resizeMode: 'cover'</Text>
                    <MathItem
                        math={rFrac}
                        backgroundColor='blue'
                        color='white'
                        scaleToFit={false}
                        resizeMode='cover'
                    />
                    <Text>resizeMode: 'stretch'</Text>
                    <MathItem
                        math={rFrac}
                        backgroundColor='blue'
                        color='white'
                        resizeMode='stretch'
                        style={{ minHeight: 300, flex: 1}}
                    />
                    <Text>chem: not fully supported</Text>
                    <MathItem
                        math={`\\ce{ 2H + {}_{ (aq) } + CO3 ^ { 2-}{ } _{ (aq) } -> CO2{ } _{ (g) } + H2O{ } _{ (l) } }`}
                        backgroundColor='blue'
                        color='white'
                        scaleToFit
                        resizeMode='contain'
                        style={{ flex: 1, minHeight: 200 }}
                    />
                </ScrollView>
            </View>
        );
    }
    
    render2() {
        return React.cloneElement(this.render1(), {
            style: { flex: 1},
            contentContainerStyle: { flexWrap: 'wrap', display: 'flex', flexDirection: 'row' },
            renderSectionHeader: ({ section: { title } }) => (<Text style={[styles.sectionHeader,{ minWidth: Dimensions.get('window').width}]}>{title}</Text>),
            renderItem: ({ item }) => {
                return (
                    <MathItem
                        math={item.string}
                        resizeMode='contain'
                        containerStyle={[styles.flexWrapContainer]}
                        style={{/*maxWidth:200, minHeight:50,*/ flexWrap: 'wrap'}}
                        //scaleToFit={false}
                    />
                );
            }
        });
    }
    
    render1() {
        return (
            <SectionList
                renderItem={({ item, index, section }) => <MathItem math={item.string} />}
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
        return <View style={{ flex: 1, justifyContent: 'center' }}>
            <MathItem
                math={this.state.tag.string}
                backgroundColor='blue'
                color='white'
            />
        </View>;
    }

    render4() {
        return null;
    }

    renderRNSvg() {
        return <SvgFromXml
            //style={{flex:1}}
            xml={MathProvider.TeXToSVG(`ax^2+bx+c`).svg}
            width='100%'
            height='100%'
            stroke='black'
            fill='black'
        />
    }

    get title() {
        const m = (this.state.state + 1) % numStates;
        switch (m) {
            case 0: return 'Stanalone View';
            case 1: return 'Flex SectionList';
            case 2: return 'FlexWrap SectionList';
            case 3: return 'Rendering on the Fly';
        }
    }

    render() {
        return (
            <>
                <Button
                    //style={{bottom: 0}}
                    onPress={async () => {
                        const state = this.state.state;
                        this.setState({ state: 4 });
                       // await MathProvider.CacheManager.clearCache();
                        this.setState({ state });
                    }}
                    title={`clear cache to test first launch`}
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
            </>
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
        flexWrap: 'wrap',
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

MathItem.defaultProps = {
    containerStyle: styles.flexContainer
}