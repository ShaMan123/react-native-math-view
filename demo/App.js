
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
            state: 2,
            tag: MathStrings.calculus.filter((obj) => obj.math)[0],
            mip: false
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
                onLayout={(e) => console.log(e.nativeEvent)}
            //onLayoutCompleted={(e)=>console.log(e.nativeEvent)}
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
    /*

    renderTestItem(item) {
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
                onLayout={(e) => console.log(e.nativeEvent)}
            //onLayoutCompleted={(e)=>console.log(e.nativeEvent)}
            />
        );
    }

    render222() {
        return (
            <View style={[styles.container, { maxWidth: this.state.width }]}>
                <FlatList
                    scrollEnabled
                    renderItem={({ item, index, section }) => this.renderTestItem(item)}
                    renderSectionHeader={({ section: { title } }) => <Text>{title}</Text>}
                    data={_.flatten(this.state.sections.map(s => s.data))}
                    onRefresh={() => {
                        this.setState({
                            sections: [
                                {
                                    title: 'calculus',
                                    data: MathStrings.calculus.filter((obj) => obj.math).reverse(),
                                    keyExtractor: (item) => `calculus:${item.string}`
                                },
                                {
                                    title: 'trig',
                                    data: MathStrings.trig.filter((obj) => obj.math).reverse(),
                                    keyExtractor: (item) => `trig:${item.string}`
                                }
                            ]
                        })
                    }}
                    refreshing={this.state.refreshing}
                    contentContainerStyle={[styles.flexContainer]}
                    keyExtractor={(item) => `${item.string}`}
                    style={{flex:1, backgroundColor:'pink'}}
                />
            </View>
        );
    }
    */
    render2() {
        return (
            <View style={[{ flex: 1, maxWidth: this.state.width }]}>
                <FlatList
                    scrollEnabled
                    renderItem={({ item, index, section }) => this.renderItem(item)}
                    renderSectionHeader={({ section: { title } }) => <Text>{title}</Text>}
                    data={_.flatten(this.state.sections.map(s => s.data))}
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
                    sections={[
                        {
                            title: 'calculus',
                            data: [this.state.sections[0].data[0]],
                            keyExtractor: (item) => `calculus:${item.string}`
                        }
                    ]}
                    sections={this.state.sections}
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

    render0() {
        return (
            <View style={[{ backgroundColor: 'pink', flex:1 }, styles.centerContent]}>
                <View style={styles.flexContainer}>
                    {this.state.tag && React.cloneElement(this.renderFlexItem(this.state.tag), {
                        stubContainerStyle: null,
                        stubStyle: null,
                        onLayout:(e)=>console.log(e.nativeEvent)
                    })}
                </View>
            </View>
        );
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
                        return { state: (prev.state + 1) % 3 };
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
        //padding: 20,
        justifyContent: 'center',
        backgroundColor: 'orange',
        
    },
    mathInner: {
        height: 35,
        minWidth: 35,
        //marginHorizontal: 35,
        padding: 5,
        justifyContent: 'center',
        backgroundColor: 'green',
    },
    centerContent: {
        justifyContent: 'center',
        alignItems: 'center',
    }
});
