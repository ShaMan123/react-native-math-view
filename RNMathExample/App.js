
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
            singleton: false
        }
        
    }
    
    componentDidMount() {
        let i = 0;
        const interval = 5000;
        const tags = MathStrings.calculus.filter((obj) => obj.math);

        setTimeout(() => {
            this.t = setInterval(() => {
                this.setState({
                    width: Math.min(Dimensions.get('window').width * (i % 4 + 1) * 0.25, Dimensions.get('window').width),
                    tag: tags[i % tags.length],
                    mip: true
                });
                i++;
            }, interval);
        }, interval)
    
        
    }

    componentWillUnmount() {
        clearInterval(this.t);
    }

    renderFlexItem(item) {
        const { string } = item;
        return (
            <MathView
                math={string}
                style={{maxWidth:this.state.width}}
            />
        );
    }

    renderItem(item) {
        return (
            <View style={[styles.flexContainer, { flex: 1, backgroundColor: 'pink', /*alignItems:'center',justifyContent:'center'*/ }]}>
                {this.renderFlexItem(item)}
            </View>
        );
    }

    render2() {
        return React.cloneElement(this.render1(), {
            contentContainerStyle: { flexWrap: 'wrap', display: 'flex', flexDirection: 'row' }
        });
    }
    
    render1() {
        return (
            <SectionList
                scrollEnabled
                renderItem={({ item, index, section }) => this.renderItem(item)}
                renderSectionHeader={({ section: { title } }) => <Text>{title}</Text>}
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

    render3() {
        return this.renderFlexItem(this.state.tag);
    }

    render0() {
        return this.renderItem(this.state.tag);
        return (
            <FlatList
                scrollEnabled
                renderItem={({ item, index }) => this.renderFlexItem(this.state.tag)}
                data={Array(5).fill(0)}
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

    __________render() {
        return (
            <ScrollView style={{flex:1, backgroundColor:'red'}}>
                {this.renderFlexItem(MathStrings.calculus[0])}
                {this.renderFlexItem(MathStrings.calculus[1])}
                {this.renderFlexItem(MathStrings.calculus[2])}
            </ScrollView>
        );
    }

    render() {
        console.log('STATE:', this.state.state);
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
