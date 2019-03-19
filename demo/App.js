
import React, {Component} from 'react';
import { Platform, StyleSheet, Text, View, TextInput, SectionList, FlatList, UIManager, Alert, Dimensions, ScrollView, YellowBox, Button } from 'react-native';
import * as _ from 'lodash';
import MathView from 'react-native-math-view';
import * as MathStrings from './math';


YellowBox.ignoreWarnings(['Warning: `flexWrap: `wrap`` is not supported with the `VirtualizedList` components.']);

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
            singleton: true
        }
        
    }
    
    componentDidMount() {
        let i = 0;
        const interval = 4000;
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

    renderFlexItem(item) {
        const { string } = item;

        return (
            <MathView
                containerStyle={[styles.mathContainer]}
                style={[styles.mathInner]}
                stubContainerStyle={{ backgroundColor: 'orange' }}
                stubStyle={{ backgroundColor: 'blue' }}
                math={string}
                fontColor='white'
                fallback={'frisck'}
                onPress={() => Alert.alert(`LaTeX: ${string}`)}
                extraData={this.state.width}
                animated
                onContainerLayout={(e) => console.log('onContainerLayout', e.nativeEvent)}
                onLayout={(e) => console.log('onLayout', e.nativeEvent)}
            />
        );
    }

    renderItem(item) {
        return (
            <View style={[styles.flexContainer, { flex: 1, backgroundColor: 'pink', marginVertical: 5 }]}>
                {this.renderFlexItem(item)}
            </View>
        );
    }

    render2() {
        const data = _.flatten(this.state.sections.map(s => s.data));
        return (
            <View style={[{ flex: 1, maxWidth: this.state.width }]}>
                <FlatList
                    scrollEnabled
                    renderItem={({ item, index, section }) => this.renderItem(item)}
                    renderSectionHeader={({ section: { title } }) => <Text>{title}</Text>}
                    data={this.state.singleton ? [data.shift()] : data}
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
                    keyExtractor={(item) => `math:flexWrap:${item.string}`}
                    refreshing={this.state.refreshing}
                    style={{ flex: 1 }}
                    extraData={this.state.width}
                    //CellRendererComponent={()=><View style={{ flex: 1, minWidth: 30, margin: 10, minHeight: 35, backgroundColor: 'purple' }} />}
                    contentContainerStyle={/*this.state.mip && */[{flexWrap:'wrap', display:'flex',flexDirection:'row'}]}
                />
            </View>
        );
    }
    
    render1() {
        return (
            <View style={[{ flex: 1, maxWidth: this.state.width }]}>
                <SectionList
                    scrollEnabled
                    renderItem={({ item, index, section }) => this.renderItem(item)}
                    renderSectionHeader={({ section: { title } }) => <Text>{title}</Text>}
                    sections={this.state.singleton? [
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
                    style={{ flex: 1 }}
                    extraData={this.state.width}
                    //contentContainerStyle={this.state.mip && styles.flexContainer}
                />
            </View>
        );
    }

    render3() {
        return React.cloneElement(this.renderFlexItem(this.state.tag), {
            containerStyle: [styles.mathContainer, styles.flexContainer, { flex: 1 }, { minWidth: 200, minHeight: 150 }],
            style: [styles.mathInner, { flex: 1 }],
            //extraData: this.state.width
        })
    }

    render0() {
        const data = [
            {
                containerStyle: [styles.mathContainer, styles.flexContainer,/* { flex: 1 }*/],
                style: [/*styles.mathInner,*/ { /*flex: 1,*/ backgroundColor: 'blue' }]
            },
            {
                containerStyle: [styles.mathContainer],
                style: [/*styles.mathInner,*/ { /*flex: 1,*/ backgroundColor: 'blue' }]
            },
            {
                containerStyle: [styles.mathContainer, styles.flexContainer,/* { flex: 1 }*/],
                style: [/*styles.mathInner,*/ { flex: 1, backgroundColor: 'blue' }]
            },
            {
                containerStyle: [styles.mathContainer, styles.flexContainer,/* { flex: 1 }*/],
                style: [styles.mathInner, { flex: 1, backgroundColor: 'blue' }]
            },
            {
                containerStyle: [styles.mathContainer, {minWidth: 200, minHeight: 150}],
                style: [styles.mathInner, { flex: 1, backgroundColor: 'blue', minWidth: 200, minHeight:50 }]
            }
        ];

        return (
            <FlatList
                scrollEnabled
                renderItem={({ item, index }) => React.cloneElement(this.renderFlexItem(this.state.tag), item)}
                data={this.state.singleton ? [data[0]] : data}
                onRefresh={() => {
                    this.setState((prevState) => {
                        return {
                            singleton: !prevState.singleton
                        };
                    });
                }}
                keyExtractor={(item, index) => `math:standalone:${index}`}
                refreshing={this.state.refreshing}
                style={{ flex: 1 }}
                extraData={this.state.width}
            />
        );
        
    }

    renderStandalones(index) {
        return [
            React.cloneElement(this.renderFlexItem(this.state.tag), {
                containerStyle: [styles.mathContainer, styles.flexContainer,/* { flex: 1 }*/],
                style: [/*styles.mathInner,*/ { /*flex: 1,*/ backgroundColor: 'blue' }]
            }),
            React.cloneElement(this.renderFlexItem(this.state.tag), {
                containerStyle: [styles.mathContainer],
                style: [/*styles.mathInner,*/ { /*flex: 1,*/ backgroundColor: 'blue' }]
            }),
            React.cloneElement(this.renderFlexItem(this.state.tag), {
                containerStyle: [styles.mathContainer, styles.flexContainer,/* { flex: 1 }*/],
                style: [/*styles.mathInner,*/ { flex: 1, backgroundColor: 'blue' }]
            }),
            React.cloneElement(this.renderFlexItem(this.state.tag), {
                containerStyle: [styles.mathContainer, styles.flexContainer,/* { flex: 1 }*/],
                style: [styles.mathInner, { flex: 1, backgroundColor: 'blue' }]
            }),
            React.cloneElement(this.renderFlexItem(this.state.tag), {
                containerStyle: [styles.mathContainer],
                style: [styles.mathInner, { flex: 1, backgroundColor: 'blue' }]
            })
        ][index];
    }
    

    render() {
        return (
            <View style={{ flex: 1 }}>
                <View style={{ flex: 1 }}>
                    {this[`render${this.state.state}`]()}
                </View>
                <Button
                    //style={{bottom: 0}}
                    onPress={() => this.setState((prev) => {
                        return { state: (prev.state + 1) % 4 };
                    })}
                    title="press to change view"
                />
            </View>
        );
    }
}
    
const styles = StyleSheet.create({
    container: {
        flex: 1,
        //flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    flexContainer: {
        display: 'flex',
        flexDirection: 'row',//styleUtil.row,
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
        alignItems: 'center',
        
    },
    mathWrapper: {
        backgroundColor: 'red',
        borderRadius: 50,
        //margin: 5,
    },
    mathContainer: {
        
        marginVertical: 15,
        marginHorizontal: 5,
        minHeight: 40,
        justifyContent: 'center',
        backgroundColor: 'orange',
        
    },
    mathInner: {
        height: 35,
        minWidth: 35,
        //marginHorizontal: 35,
        padding: 5,
        justifyContent: 'center',
        backgroundColor: 'blue',
    },
    centerContent: {
        justifyContent: 'center',
        alignItems: 'center',
    }
});
