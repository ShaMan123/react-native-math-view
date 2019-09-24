
import { createContext } from 'react';
import { Animated } from 'react-native';

export interface IAppContext {
    switch: boolean,
    width: number | string | Animated.Value | Animated.AnimatedInterpolation,
    inc: number
}

const AppContext = createContext<IAppContext>({ switch: false, width: '100%', inc: 0 });
export default AppContext;