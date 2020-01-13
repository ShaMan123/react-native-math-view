
import * as _ from 'lodash';
import React, { useContext, useMemo } from 'react';
import { View, Text, I18nManager } from 'react-native';
import AppContext from './Context';
import MathStrings from './math';
import MathItem from './MathItem';
import styles from './styles';

const processString = _.replace(`When $a \\ne 0$, there are two solutions to \\(ax^2 + bx + c = 0\\) and they are
$$x = {-b \\pm \\sqrt{b^2-4ac} \\over 2a}.$$`, /\\(\(|\))/g, '$')

const allMath = _.flatten(_.values(MathStrings));
export default function Standalone() {
    //const curr = useContext(AppContext).inc;
    //const tag = useMemo(() => allMath[curr % allMath.length], [curr]);
    console.log(_.split(processString, /\$+/g))

    return (
        <View style={[styles.default, styles.centerContent]}>
            <MathItem
                math={processString}
                style={styles.defaultColorTheme}
            />
            <View
                style={{ flexWrap: 'wrap', display: 'flex', flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row', backgroundColor: 'pink' }}
            >
                {
                    _.map(_.split(processString, /\$+/g), (value, i) => {
                        if (value === '') return null;
                        const isMath = i % 2 === 1;
                        return isMath ?
                            <MathItem
                                key={value}
                                math={value}
                                style={styles.defaultColorTheme}
                                containerStyle={[styles.flexContainer, { margin: 0, alignItems: 'flex-start' }]}
                            /> :
                            <Text key={value} style={[styles.defaultColorTheme, { backgroundColor: 'green', fontSize: 16, textAlignVertical: 'center' }]}>{value}</Text>

                    })
                }
            </View>
            <MathItem
                math={`\\text{${_.replace(processString, /\$\$/g, '$')}}`}
                style={styles.defaultColorTheme}
            />
            <MathItem
                math={`\\text{${_.replace(processString, /\$\$/g, '$')}}`}
                style={styles.defaultColorTheme}
            />
        </View>
    );
}