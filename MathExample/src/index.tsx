
import * as _ from 'lodash';
import React, { useCallback, useMemo, useState, useEffect } from 'react';
import { Button, StyleSheet, Switch, Text, View, TouchableOpacity, LayoutRectangle } from 'react-native';
//import { MathjaxFactory } from 'react-native-math-view/src';
import MathjaxFactory, { FactoryMemoize } from 'react-native-math-view/src/mathjax';
import MathView, { ControlledMathView } from 'react-native-math-view/src';
import AppContext from './Context';
import DifferentLayouts from './DifferentLayouts';
import FlexWrapMathSectionList from './FlexWrapMathSectionList';
import { useInc, useWidth, useColor, color } from './Hooks';
import MathStrings, { getRecursiveFrac, getTaylor } from './math';
import MathItem from './MathItem';
import MathSectionList from './MathSectionList';
import Standalone from './Standalone';
import styles from './styles';
import { parse } from 'svg-parser';

const numStates = 4;

const interval = 3000;

const allMath = _.flatten(_.values(MathStrings));
const test = allMath[0]//'\\frac{\\cos\\left(x\\right)}{\\sin\\left(x\\right)}'// allMath[0];//'\\cos\\left(x\\right)';

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

function MathFragment() {
    //const color = useColor();
    const [layout, setLayout] = useState<LayoutRectangle>({});
    const data = MathjaxFactory().toSVGArray(test);
    console.log(String.fromCharCode(73))
    //const splitData = MathjaxFactory().splitMath(test);
    //console.log(parse(data[0].svg).children)
    return (
        <View  style={{ alignItems: 'flex-end', direction: 'ltr' }}>
            <MathItem
                math={test}
                containerStyle={{ backgroundColor: 'red', opacity: 0 }}
                onLayout={e => setLayout(e.nativeEvent.layout)}
                onPress={e => {
                    const { locationX, locationY } = e.nativeEvent;
                    
                    const hitSlop = {
                        left: 0,
                        top: -20,
                        right: 0,
                        bottom: 20
                    };
                    _.map(data, ({ layoutRect }, index) => {
                        const left = layout.x + layoutRect.x * layout.width;
                        const top = layout.y + layoutRect.y * layout.height;
                        const width = layoutRect.width * layout.width;
                        const height = layoutRect.height * layout.height;
                        const right = left + width;
                        const bottom = top + height;

                        const inside = locationX >= left + hitSlop.left && locationX <= right + hitSlop.right && locationY >= top + hitSlop.top && locationY <= bottom + hitSlop.bottom;
                        inside && console.log(index, String.fromCharCode(data[index].namespace.charCode))
                        //console.log(locationX, left, right, inside, layoutRect)
                    })
                    
                }}
            />
           
                {_.map(data, ({ svg, layoutRect }, index) => {

                return (
                    <View
                        pointerEvents='none'
                        key={`MEditable${index}`}
                        style={[StyleSheet.absoluteFill, [styles.flexContainer, { margin: 0 }],{ alignItems: 'flex-end', flexDirection: 'row-reverse' }]}
                    >
                        <ControlledMathView
                       
                            //math='abc' 
                            //math={math}
                            svg={svg}
                            containerStyle={[styles.flexContainer, { margin: 0 }]}
                            style={[styles.flexContainer, { color: color() }]}
                            //onLayout={e=>console.log(e.nativeEvent)}
                        />
                    </View>
                )
            })}
            
        </View>
    );

    return (
        <View style={{ alignItems: 'flex-end', direction: 'ltr' }}>
            <MathItem math={test} containerStyle={{ backgroundColor: 'red' }} />

            {_.map(_.reject(MathjaxFactory().splitMath(test), math => false/*math.match(/((\\left)|(\\right))|(\\frac)/)*/), (math, index) => {
                const svg = MathjaxFactory().toSVG(math);
                console.log(math, svg)
                return (
                    <View key={`MEditable${index}`} style={[StyleSheet.absoluteFill, { alignItems: 'flex-end', flexDirection: 'row-reverse', margin: 5 }]}>
                        <ControlledMathView

                            //math='abc' 
                            //math={math}
                            svg={svg}
                            containerStyle={[styles.flexContainer, { margin: 0 }]}
                            style={{ color: `rgb(${Math.pow(index, 2) % 255}, 255,0)` }}
                            onPress={e => console.log(index)}
                        />
                    </View>
                )
            })}

        </View>
    );
    /*

return (
        <View style={{alignItems: 'flex-end', direction:'ltr'}}>
            <MathItem math={test} />
            <View style={[StyleSheet.absoluteFill, { alignItems: 'flex-end', flexDirection:'row-reverse' ,margin:5}]}>
                <MathItem math={'\\cos'} containerStyle={[styles.flexContainer, { margin: 0 }]} onPress={e=>console.log('cos')} />
                <MathItem math={'\\left(x\\right)'} containerStyle={[styles.flexContainer, { margin: 0 }]} />
                </View>
            </View>
        );
    */
    return (
        <View style={{ alignItems: 'flex-end', direction: 'ltr' }}>
            <MathItem math={test} />
        </View>
    );
}

export default function App() {
    useEffect(() => {
        MathjaxFactory().preload(_.slice(allMath, 0, 5));
    }, [])
    const [page, setPage] = useState(4);

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
            case 4: return <MathView math={test} action='edit' />
                
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