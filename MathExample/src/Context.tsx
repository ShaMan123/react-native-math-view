
import { createContext, useContext } from 'react';
import { Animated } from 'react-native';

export interface IAppContext {
    switch: boolean,
    width: number | string | Animated.Value | Animated.AnimatedInterpolation,
    inc: number,
    page: number,
    setPage: (index: number) => void,
    switchValue: boolean,
    setSwitchValue: (index: boolean) => void
}

const AppContext = createContext<IAppContext>({
    switch: false,
    width: '100%',
    inc: 0,
    page: -1,
    setPage: () => { throw new Error('AppContext not initialized') },
    switchValue: false,
    setSwitchValue: () => { throw new Error('AppContext not initialized') },
});

export function useAppContext() {
    return useContext(AppContext);
}

export default AppContext;