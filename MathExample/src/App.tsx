import { createBrowserApp } from '@react-navigation/web';
import _ from 'lodash';
import React, { useCallback } from 'react';
import { FlatList, Platform, StyleSheet, Text, View } from 'react-native';
import { RectButton, ScrollView } from 'react-native-gesture-handler';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import Basic from './Basic';
import Scrollable from './Scrollable';
import Synced from './Synced';
import Variety from './Variety';
import JSTouchHandling from './JSTouchHandling';
import ScrollableCanvas from './ScrollView';
import Updater from './Updater';
import DeclarativeUpdate from './DeclarativeUpdate';

const SCREENS = {
  Basic: { screen: Basic, title: 'Basic' },
  Synced: { screen: Synced, title: 'Sync two canvases' },
  Variety: { screen: Variety, title: 'Images, Text, Buttons & Paths' },
  ImperativeUpdater: { screen: Updater, title: 'Imperative Updating' },
  DeclarativeUpdate: { screen: DeclarativeUpdate, title: 'Declarative Updating' },
  Scrollable: { screen: Scrollable, title: 'Scrollable-ish' },
  ScrollableCanvas: { screen: ScrollableCanvas, title: 'ScrollableCanvas' },
  JSTouchHandling: { screen: JSTouchHandling, title: 'Custom JS Touch Handling (Backward Compatibility)' },
};

_.map(SCREENS, ({ screen, title }) => _.set(screen, 'navigationOptions.title', title));

function MainScreen(props) {
  const data = Object.keys(SCREENS).map(key => ({ key }));
  return (
    <FlatList
      style={styles.list}
      data={data}
      ItemSeparatorComponent={ItemSeparator}
      renderItem={p => (
        <MainScreenItem
          {...p}
          onPressItem={({ key }) => props.navigation.navigate(key)}
        />
      )}
      renderScrollComponent={props => <ScrollView {...props} />}
    />
  );
}

const ItemSeparator = () => <View style={styles.separator} />;

function MainScreenItem(props) {
  const _onPress = useCallback(() => props.onPressItem(props.item), [props])
  const { key } = props.item;
  return (
    <RectButton style={styles.button} onPress={_onPress}>
      <Text style={styles.buttonText}>{SCREENS[key].title || key}</Text>
    </RectButton>
  );
}

const ExampleApp = createStackNavigator(
  {
    Main: { screen: MainScreen },
    ...SCREENS
  },
  {
    initialRouteName: 'Main',
    headerMode: 'screen',
  }
);

const styles = StyleSheet.create({
  list: {
    backgroundColor: '#EFEFF4',
  },
  separator: {
    height: 1,
    backgroundColor: '#DBDBE0',
  },
  buttonText: {
    backgroundColor: 'transparent',
  },
  button: {
    flex: 1,
    height: 60,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});

const createApp = Platform.select({
  web: input => createBrowserApp(input, { history: 'hash' }),
  default: input => createAppContainer(input),
});

export default createApp(ExampleApp);
