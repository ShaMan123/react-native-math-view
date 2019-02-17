import {
    NativeModules,
    LayoutAnimation,
    Platform
} from 'react-native';

const { UIManager } = NativeModules;
//if (Platform.OS === 'android') UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);