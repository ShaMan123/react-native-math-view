
import * as _ from 'lodash';
import React, { Component, useEffect, useState, useCallback, useMemo } from 'react';
import { Button, Dimensions, ScrollView, SectionList, StyleSheet, Text, TouchableOpacity, View, YellowBox, I18nManager, SectionListProps, Switch } from 'react-native';
import MathView, { MathProvider, useCalculatedStyle } from 'react-native-math-view';
import MathStrings, { getFrac, getRecursiveFrac, getTaylor } from './math';
import data from './tags';
import { SvgXml } from 'react-native-svg';
import { SvgFromXml } from './rnsvg'
import MathItem from './MathItem';
import styles from './styles';
import FlexWrapMathSectionList from './FlexWrapMathSectionList';
import MathSectionList from './MathSectionList';
import Standalone from './Standalone';
import DifferentLayouts from './DifferentLayouts';
import AppContext from './Context';
import { useWidth, useInc } from './Hooks';


const numStates = 4;

const interval = 3000;

const allMath = _.flatten(_.values(MathStrings));

function RNSvg() {
    return <SvgFromXml
        //style={{flex:1}}
        xml={MathProvider.mathToSvg(`ax^2+bx+c`).svg}
        width='100%'
        height='100%'
        stroke='black'
        fill='black'
    />
}

export default function App() {
    const [page, setPage] = useState(0);

    const incPage = useCallback(() => {
        setPage((page + 1) % numStates);
    }, [page]);
    const title = useMemo(() => {
        const m = (page + 1) % numStates;
        switch (m) {
            case 0: return 'Stanalone View';
            case 1: return 'Flex SectionList';
            case 2: return 'FlexWrap SectionList';
            case 3: return 'Rendering on the Fly';
        }
    }, [page]);

    const [switchValue, setSwitchValue] = useState(false);

    const el = useMemo(() => {
        const m = (page) % numStates;
        switch (m) {
            case 0: return <Standalone />
            case 1: return <MathSectionList />;
            case 2: return <FlexWrapMathSectionList />;
            case 3: return <DifferentLayouts />;
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
            <Button
                //style={{bottom: 0}}
                onPress={incPage}
                title={`change to ${title}`}
            />
            <Switch
                onValueChange={setSwitchValue}
                value={switchValue}
            />
            <Text>{switchValue ? 'hyper mode': 'static mode'}</Text>
        </>
    );
}