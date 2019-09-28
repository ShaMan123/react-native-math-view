
import * as _ from 'lodash';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Switch, Text, View } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import MathjaxFactory, { FactoryMemoize } from 'react-native-math-view/src/mathjax';
import AppContext from './Context';
import DifferentLayouts from './DifferentLayouts';
import FlexWrapMathSectionList from './FlexWrapMathSectionList';
import { useInc, useWidth } from './Hooks';
import MathStrings from './math';
import MathSectionList from './MathSectionList';
import Standalone from './Standalone';
import styles from './styles';
import TouchableMathList from './TouchableMathView';

const allMath = _.flatten(_.values(MathStrings));

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
            case 4: return <TouchableMathList />
                
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