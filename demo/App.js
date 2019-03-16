
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
            width: Dimensions.get('window').width-50,
            fontScale: 1
        }

        this.ref = React.createRef();
    }
    
    componentDidMount() {
        let i = 0;
        const interval = 7000;
        
        this.t = setInterval(() => {
            this.setState({ width: Dimensions.get('window').width * (i % 4 + 1) * 0.25 });
            i++;
        }, interval);
        
    }

    componentWillUnmount() {
        clearInterval(this.t);
    }

    renderItem(item) {
        const { string } = item;
        return (
            <MathView
                style={[styles.math, { backgroundColor: 'red' }, { maxWidth: this.state.width }]} //{ display: 'flex',alignItems: 'center',/* justifyContent: 'flex-start', alignContent: 'flex-start', backgroundColor: 'red',*/ margin: 10}]}
                math={string}
                text={string}
                fontColor='white'
                //layoutProvider={this.ref}
                fallback={'frisck'}
                onPress={() => Alert.alert(`LaTeX: ${string}`)}
                containerStyle={{ padding: 5, backgroundColor: 'red' }}
            //onLayoutCompleted={(e)=>console.log(e.nativeEvent)}
            />
        );
    }

    render3() {
        return (
            <View style={[styles.container]} ref={this.ref}>
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
                    style={{flex:1}}
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
    

    render() {
        return this.render3();
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
    math: {
        borderRadius: 25,
        margin: 5,
        maxHeight: 35,
        justifyContent: 'center'
    }
});
