
import * as _ from 'lodash';
import React, { useCallback, useEffect, useMemo, useState, useRef } from 'react';
import { Button, LayoutRectangle, StyleSheet, Switch, Text, View, SectionList, Animated } from 'react-native';
import MathView, { ControlledMathView, MathViewProps } from 'react-native-math-view/src';
import MathjaxFactory, { FactoryMemoize } from 'react-native-math-view/src/mathjax';
import AppContext from './Context';
import DifferentLayouts from './DifferentLayouts';
import FlexWrapMathSectionList from './FlexWrapMathSectionList';
import { color, useInc, useWidth } from './Hooks';
import MathStrings from './math';
import MathItem from './MathItem';
import MathSectionList from './MathSectionList';
import Standalone from './Standalone';
import styles from './styles';
import { TapGestureHandler, RectButton, State, FlatList, TapGestureHandlerStateChangeEvent } from 'react-native-gesture-handler';

const numStates = 4;

const interval = 3000;

const allMath = _.flatten(_.values(MathStrings));
const test = allMath[4]//'\\frac{\\cos\\left(x\\right)}{\\sin\\left(x\\right)}'// allMath[0];//'\\cos\\left(x\\right)';

function getTitle(index: number) {
    switch (index) {
        case -1: return 'Back To Menu';
        case 0: return 'Stanalone View';
        case 1: return 'Flex SectionList';
        case 2: return 'FlexWrap SectionList';
        case 3: return 'Rendering on the Fly';
        default: return '';
    }
}

function TouchableMathView({ math }: MathViewProps) {
    const [editable, setEditable] = useState(false);
    const ref = useRef();
    const reactToTouch = useCallback((x: number, y: number) => ref.current && ref.current.__test(x, y), [ref]);
    /*
    useEffect(() => {
        console.log()
    })
    */
    return (
        <TapGestureHandler
            onHandlerStateChange={e => {
                if (!editable) setEditable(true);
                //console.log('go go go', e.nativeEvent)
                e.nativeEvent.state === State.ACTIVE && reactToTouch(e.nativeEvent.x, e.nativeEvent.y)
            }}
            enabled
        >
            <Animated.View collapsable={false}>
                <MathItem
                    math={math}
                    action={editable ? 'edit' : 'none'}
                    ref={ref}
                    containerStyle={[styles.flexContainer, { justifyContent: 'flex-end'}]}
                />
            </Animated.View>
        </TapGestureHandler>
    );
}

export default function App() {
    useEffect(() => {
        MathjaxFactory().preload(_.slice(allMath, 0, 5));
    }, [])
    const [page, setPage] = useState(-1);

    const [switchValue, setSwitchValue] = useState(false);

    const PageSelector = useCallback(({ index }: { index: number }) => {
        return (
            <RectButton
                onPress={() => setPage(index)}
                
            >
                <Text style={[styles.defaultColorTheme, { padding: 10, margin: 20, textAlign: 'center' }]}>{getTitle(index)}</Text>
            </RectButton>
        );
    }, []);

    const el = useMemo(() => {
        switch (page) {
            case -1:
                return (
                    <View style={styles.default}>
                    <View style={{ flex: 1, justifyContent: 'space-evenly' }}>
                        <PageSelector index={0} />
                        <PageSelector index={1} />
                        <PageSelector index={2} />
                        <PageSelector index={3} />
                        <PageSelector index={4} />
                        </View>
                        <View style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Button
                                onPress={() => FactoryMemoize.cache.clear()}
                                title='clear cache'
                                color='blue'
                            />
                            <Button
                                onPress={() => MathjaxFactory().preload(_.slice(allMath, 0, 10))}
                                title='preload'
                            />
                        </View>
                        </View>
                );
            case 0: return <Standalone />
            case 1: return <MathSectionList />;
            case 2: return <FlexWrapMathSectionList />;
            case 3: return <DifferentLayouts />;
            case 4: return <FlatList
                style={styles.default}
                data={allMath}
                renderItem={({ item: math }) => <TouchableMathView math={math} />}
                keyExtractor={(m, i) => `TouchableMathView${i}`}
            />
                
            default: null
        }
    }, [page]);

    return (
        <>
            <View style={styles.default}>
                <AppContext.Provider
                    value={{
                        switch: switchValue,
                        width: useWidth(switchValue),
                        inc: useInc(switchValue)
                    }}
                >
                    {el}
                </AppContext.Provider>
            </View>
            {
                page !== -1 &&
                <View style={{ borderColor: 'darkblue', borderWidth: 2 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                        <Switch
                            onValueChange={setSwitchValue}
                            value={switchValue}
                        />
                        <Text style={{ fontWeight: switchValue ? 'bold' : 'normal' }}>{switchValue ? 'HYPER mode' : 'static mode'}</Text>
                    </View>
                    <PageSelector index={-1} />
                </View>
            }

        </>
    );
}