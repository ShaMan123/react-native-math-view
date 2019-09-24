
import * as _ from 'lodash';
import React, { useCallback, useMemo, useState } from 'react';
import { Button, Switch, Text, View } from 'react-native';
import { MathProvider } from 'react-native-math-view';
import Svg, { SvgXml, SvgFromXml, Use, G } from 'react-native-svg';
import AppContext from './Context';
import DifferentLayouts from './DifferentLayouts';
import FlexWrapMathSectionList from './FlexWrapMathSectionList';
import { useInc, useWidth } from './Hooks';
import MathStrings from './math';
import MathSectionList from './MathSectionList';
import Standalone from './Standalone';
import styles from './styles';


const numStates = 4;

const interval = 3000;

const allMath = _.flatten(_.values(MathStrings));

function getTitle(index: number) {
    switch (index % numStates) {
        case -1: return 'Back To Menu';
        case 0: return 'Stanalone View';
        case 1: return 'Flex SectionList';
        case 2: return 'FlexWrap SectionList';
        case 3: return 'Rendering on the Fly';
        default: return '';
    }
}

export default function App() {
    const [page, setPage] = useState(-1);

    const incPage = useCallback(() => {
        setPage((page + 1) % numStates);
    }, [page]);

    const [switchValue, setSwitchValue] = useState(false);

    const PageSelector = useCallback(({ index }: { index: number }) => {
        return (
            <Button
                onPress={() => setPage(index)}
                title={getTitle(index)}
            />
        );
    }, []);

    const el = useMemo(() => {
        const m = (page) % numStates;
        switch (m) {
            case -1:
                return (
                    <View style={{ flex: 1, justifyContent: 'space-evenly' }}>
                        <PageSelector index={0} />
                        <PageSelector index={1} />
                        <PageSelector index={2} />
                        <PageSelector index={3} />
                    </View>
                );
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