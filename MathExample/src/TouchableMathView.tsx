
import React, { useCallback, useRef, useState } from 'react';
import { Animated, SectionListProps, I18nManager } from 'react-native';
import { State, TapGestureHandler, PanGestureHandler, GestureHandlerGestureEvent, PanGestureHandlerGestureEvent, TapGestureHandlerStateChangeEvent } from 'react-native-gesture-handler';
import { MathViewProps } from 'react-native-math-view/src';
import MathStrings from './math';
import MathItem from './MathItem';
import MathSectionList from './MathSectionList';
import styles from './styles';

export function TouchableMathView({ math }: MathViewProps) {
    const [editing, setEditable] = useState(false);
    const ref = useRef();
    const reactToTouch = useCallback((e: PanGestureHandlerGestureEvent | TapGestureHandlerStateChangeEvent) => {
        if (!editing) {
            setEditable(true);
            return;
        }
        console.log(e.nativeEvent)
        ref.current && ref.current.__test(e.nativeEvent.x, e.nativeEvent.y);
    }, [ref]);
    
    const tap = useRef();
    const pan = useRef();

    return (
        <TapGestureHandler
            onHandlerStateChange={reactToTouch}
            ref={tap}
        >
            <Animated.View collapsable={false}>
                <PanGestureHandler
                    onGestureEvent={reactToTouch}
                    ref={pan}
                    //waitFor={[tap]}
                >
                    <Animated.View collapsable={false}>
                        <MathItem
                            math={math}
                            action={editing ? 'edit' : 'none'}
                            ref={ref}
                            containerStyle={[styles.flexContainer, { justifyContent: I18nManager.isRTL ? 'flex-end' : 'flex-start' }]}
                        />
                    </Animated.View>
                </PanGestureHandler>
            </Animated.View>
        </TapGestureHandler>
    );
}

export default function TouchableMathList(props: Partial<SectionListProps<typeof MathStrings>>) {
    return (
        <MathSectionList
            {...props}
            style={styles.default}
            renderItem={({ item: math }) => <TouchableMathView math={math} />}
            keyExtractor={(m, i) => `TouchableMathView${i}`}
        />
    );
}