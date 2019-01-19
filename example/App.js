/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import { Platform, StyleSheet, Text, View, TextInput, SectionList, UIManager, Alert } from 'react-native';
import MathView from 'react-native-math-view';
import * as MathStrings from './math';
import {uniqueId} from 'lodash';

if (Platform.OS === 'android') UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(false);

export default class App extends Component {
    render() {
        return (
            <View style={styles.container}>
                <SectionList
                    scrollEnabled
                    renderItem={({ item, index, section }) => {
                        const { string, key } = item;
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
                    sections={[
                        { title: 'calculus', data: MathStrings.calculus.filter((obj) => obj.math) },
                        { title: 'trig', data: MathStrings.trig.filter((obj) => obj.math) }
                    ]}
                    keyExtractor={(item, index) => uniqueId('MathView')}
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
                                 minWidth: 360
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
                                 flex:1,
                                 
                                 height: 100,
                                 backgroundColor: 'pink'
    }
});
