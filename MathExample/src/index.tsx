
import _ from 'lodash';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Switch, Text, View } from 'react-native';
import { RectButton, FlatList } from 'react-native-gesture-handler';
import MathjaxFactory, { FactoryMemoize } from 'react-native-math-view/src/mathjax';
import AppContext, { useAppContext } from './Context';
import DifferentLayouts from './DifferentLayouts';
import FlexWrapMathSectionList from './FlexWrapMathSectionList';
import { useInc, useWidth } from './Hooks';
import MathStrings from './math';
import MathSectionList from './MathSectionList';
import Standalone from './Standalone';
import styles from './styles';
import TouchableMathList from './TouchableMathView';
import SvgXml from './SvgXml';
import WrapWithText from './WrapWithText';

const allMath = _.flatten(_.values(MathStrings));

const SCREENS = [
    { title: 'Stanalone View', component: Standalone },
    { title: 'Flex SectionList', component: MathSectionList },
    { title: 'FlexWrap SectionList', component: FlexWrapMathSectionList },
    { title: 'Rendering on the Fly', component: DifferentLayouts },
    { title: 'Touch to Edit SectionList', component: TouchableMathList },
    { title: 'Inline Text', component: WrapWithText },
    { title: 'Fallback (SvgXml)', component: SvgXml },
];


function PageSelector({ index, title }: { index: number, title: string }) {
    const { setPage } = useAppContext();
    return (
        <RectButton
            onPress={() => setPage(index)}
        >
            <Text
                style={[styles.defaultColorTheme, { padding: 10, margin: 20, textAlign: 'center' }]}
            >
                {title}
            </Text>
        </RectButton>
    );
}

function MainScreen() {
    return (
        <View style={styles.default}>
            <FlatList
                data={SCREENS}
                renderItem={({ item, index }) => <PageSelector index={index} title={item.title} />}
                keyExtractor={(item, index) => `PageSelector${index}`}
            />
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
    )
}

const Page = () => {
    const { inc, page, setPage, switchValue, setSwitchValue } = useAppContext();
    switch (page) {
        case -1:
            return (
                <MainScreen />
            );
        default:
            const El = SCREENS[page].component;
            return <>
                <El />
                <View style={{ borderColor: 'darkblue', borderWidth: 2 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                        <Switch
                            onValueChange={setSwitchValue}
                            value={switchValue}
                        />
                        <Text style={{ fontWeight: switchValue ? 'bold' : 'normal' }}>{switchValue ? 'HYPER mode' : 'static mode'}</Text>
                    </View>
                    <PageSelector index={-1} title="Back" />
                </View>
            </>
    }
}

export default function App() {
    useEffect(() => {
        MathjaxFactory().preload(_.slice(allMath, 0, 5));
    }, [])
    const [page, setPage] = useState(-1);
    const [switchValue, setSwitchValue] = useState(false);

    return (
        <AppContext.Provider
            value={{
                switch: switchValue,
                width: useWidth(switchValue),
                inc: useInc(switchValue),
                page,
                setPage,
                switchValue,
                setSwitchValue
            }}
        >
            <Page />
        </AppContext.Provider>
    );
}