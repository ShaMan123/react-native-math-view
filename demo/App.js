
import React, {Component} from 'react';
import { Platform, StyleSheet, Text, View, TextInput, SectionList, FlatList, UIManager, Alert, Dimensions, ScrollView, i18Manager } from 'react-native';
import * as _ from 'lodash';
import MathView from 'react-native-math-view';
import * as MathStrings from './math';

//if (Platform.OS === 'android') UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(false);
//i18Manager.allowRTL(false);
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
            width: Dimensions.get('window').width - 50,
            tag: null,
            fontScale: 1
        }

        this.ref = React.createRef();
    }
    
    componentDidMount() {
        let i = 0;
        const interval = 7000;
        const tags = MathStrings.calculus.filter((obj) => obj.math);
        
        this.t = setInterval(() => {
            this.setState({
                width: Math.min(Dimensions.get('window').width * (i % 4 + 1) * 0.25, Dimensions.get('window').width - 50),
                tag: tags[i%tags.length]
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
                containerStyle={[styles.math, { backgroundColor: 'red' }]}
                style={[{ maxWidth: this.state.width, maxHeight: 35}]}
                math={string}
                text={string}
                fontColor='white'
                //layoutProvider={this.ref}
                fallback={'frisck'}
                onPress={() => Alert.alert(`LaTeX: ${string}`)}
            //onLayoutCompleted={(e)=>console.log(e.nativeEvent)}
            />
        );
    }

    renderItem(item) {
        const { string } = item;
        return (
            <View style={[styles.flexContainer, { flex: 1, backgroundColor: 'pink', margin: 5 }]}>
                <MathView
                    containerStyle={[styles.math, { backgroundColor: 'red' }]}
                    style={[{ maxWidth: this.state.width, height: 35, justifyContent: 'center' }]}
                    math={string}
                    text={string}
                    fontColor='white'
                    //layoutProvider={this.ref}
                    fallback={'frisck'}
                    onPress={() => Alert.alert(`LaTeX: ${string}`)}
                //onLayoutCompleted={(e)=>console.log(e.nativeEvent)}
                />
            </View>
        );
    }

    render3() {
        return (
            <View style={[styles.container]} ref={this.ref}>
                <FlatList
                    scrollEnabled
                    renderItem={({ item, index, section }) => this.renderFlexItem(item)}
                    renderSectionHeader={({ section: { title } }) => <Text>{title}</Text>}
                    data={_.flatten(this.state.sections.map(s => s.data))}
                    onRefresh={() => {
                        this.setState({
                            sections: [
                                {
                                    title: 'calculus',
                                    data: MathStrings.calculus.filter((obj) => obj.math),
                                    keyExtractor: (item) => `calculus:${item.string}` + new Date().valueOf()
                                },
                                {
                                    title: 'trig',
                                    data: MathStrings.trig.filter((obj) => obj.math),
                                    keyExtractor: (item) => `trig:${item.string}` + new Date().valueOf()
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
    
    render2() {
        return (
            <View style={[{ flex: 1 }]} ref={this.ref}>
                <SectionList
                    scrollEnabled
                    renderItem={({ item, index, section }) => this.renderItem(item)}
                    renderSectionHeader={({ section: { title } }) => <Text>{title}</Text>}
                    sections={this.state.sections}
                    onRefresh={() => {
                        this.setState({
                            sections: [
                                {
                                    title: 'calculus',
                                    data: MathStrings.calculus.filter((obj) => obj.math),
                                    keyExtractor: (item) => `calculus:${item.string}` + new Date().valueOf()
                                },
                                {
                                    title: 'trig',
                                    data: MathStrings.trig.filter((obj) => obj.math),
                                    keyExtractor: (item) => `trig:${item.string}` + new Date().valueOf()
                                }
                            ]
                        })
                    }}
                    refreshing={this.state.refreshing}
                    style={{flex:1}}
                />
            </View>
        );
    }

    renderT() {
        return this.state.tag && React.cloneElement(this.renderItem(this.state.tag), { style: [styles.math, { backgroundColor: 'red', display: 'flex', maxWidth: 200}] });
    }
    

    render() {
        return this.render2();
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
        alignItems: 'center'
    },
    math: {
        borderRadius: 50,
        margin: 5,
        padding: 10,
        justifyContent: 'center'
    }
});
