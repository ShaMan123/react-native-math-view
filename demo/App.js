/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import { Platform, StyleSheet, Text, View, TextInput, SectionList, UIManager, Alert, Ref } from 'react-native';
import MathView from 'react-native-math-view';
import * as MathStrings from './math';

//if (Platform.OS === 'android') UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(false);

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
            ]
        }
    }
   

    render() {
        return (
            <View style={styles.container}>
                <SectionList
                    scrollEnabled
                    renderItem={({ item, index, section }) => {
                        const { string } = item;
                        return (
                            <MathView
                                style={styles.math}
                                math={string}
                                text={string}
                                value={string}
                                fallback={'frisck'}
                                onPress={() => Alert.alert(`LaTeX: ${string}`)}
                            //fontColor={this.getColor()}
                            //enableAnimation={false}
                            />
                        );
                    }}
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
                />
            </View>
        );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
      backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
    },
    math: {
        paddingVertical: 5,
        backgroundColor: 'blue'
    }
});
