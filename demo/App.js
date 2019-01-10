/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import { Platform, StyleSheet, Text, View, TextInput, SectionList } from 'react-native';
import MathView from 'react-native-math-view';
import * as MathStrings from './math';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

type Props = {};
export default class App extends Component<Props> {
    render() {
        return (
            <View style={styles.container}>
                <SectionList
                    scrollEnabled
                    renderItem={({ item, index, section }) => {
                        const { string, key } = item;
                        return (
                            <MathView
                                math={string}
                                text={string}
                                value={string}
                                fallback={'frisck'}
                                //enableAnimation={false}
                            />
                        );
                    }}
                    renderSectionHeader={({ section: { title } }) => <Text>{title}</Text>}
                    sections={[
                        { title: 'calculus', data: MathStrings.calculus.filter((obj) => obj.math) },
                        { title: 'trig', data: MathStrings.trig.filter((obj) => obj.math) }
                    ]}
                    keyExtractor={(item, index) => item.key}
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
      backgroundColor: 'pink'
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
});
