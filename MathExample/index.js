/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from '../App';
import { name as appName } from './app.json';
import { MathProviderHOC } from 'react-native-math-view';

AppRegistry.registerComponent(appName, () => MathProviderHOC(App));
