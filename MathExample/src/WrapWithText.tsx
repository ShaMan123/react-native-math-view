
import * as _ from 'lodash';
import React, { useContext, useMemo } from 'react';
import { View, Text, I18nManager } from 'react-native';
import AppContext from './Context';
import MathStrings from './math';
import MathItem from './MathItem';
import styles from './styles';
import { TouchableOpacity, FlatList } from 'react-native-gesture-handler';

const processString = _.replace(`When $a \\ne 0$, there are two solutions to \\(ax^2 + bx + c = 0\\) and they are $$x = {-b \\pm \\sqrt{b^2-4ac} \\over 2a}.$$`, /\\(\(|\))/g, '$');
const processString1 = `hello world! I'm trying to understand why $ $flex wrap styling messes up text vertical alignment`

const allMath = _.flatten(_.values(MathStrings));

function InlineItem({ value, index: i }: { value: string, index: number }) {
    if (value === '') return null;
    const isMath = i % 2 === 1;
    return isMath ?
        <MathItem
            key={value}
            math={value}
            style={styles.defaultColorTheme}
            containerStyle={[styles.inlineContainer]}
        /> :
        <TouchableOpacity
            style={[styles.default, styles.centerContent]}
            key={value}
        >

            <Text style={[styles.defaultColorTheme, { fontSize: 16, fontStyle: 'italic' }]}>{value}</Text>
        </TouchableOpacity>

}


export default function Composition() {
    return (
        <View style={[styles.default, { backgroundColor: 'pink' }]}>
            <Text>Compose with Text & MathView</Text>
            <Text>For some unknown reason `textAlignVertical` doesn't seem to work properly, so do all flex centering styling props.</Text>
            <Text>WorkAround: use margin</Text>
            <View
                style={[styles.diverseContainer]}
            >
                {
                    _.map(_.split(processString, /\$+/g), (value, i) => {
                        return <InlineItem value={value} index={i} key={`${value}${i}`} />
                    })
                }
            </View>
            <Text>Compose with FlatList</Text>
            <View>
                <FlatList
                    data={_.split(processString, /\$+/g)}
                    renderItem={({ index, item }) => <InlineItem value={item} index={index} />}
                    keyExtractor={(item, index) => `${item}${index}`}
                    contentContainerStyle={[{ flexWrap: 'wrap', display: 'flex' }, styles.flexLeft]}
                />
            </View>
            <Text>Split input, wrap text with op \\text{}</Text>
            <View
                style={styles.diverseContainer}
            >
                {
                    _.map(_.split(processString, /\$\$/g), (value, i) => {
                        if (value === '') return null;
                        const isMath = i % 2 === 1;
                        return (
                            <MathItem
                                key={value}
                                math={isMath ? value : `\\text{${value}}`}
                                style={styles.defaultColorTheme}
                                containerStyle={[styles.flexContainer, { margin: 0, alignItems: 'flex-start' }]}
                            />
                        )
                    })
                }
            </View>
            <Text>Inline</Text>
            <MathItem
                math={`\\text{${_.replace(processString, /\$\$/g, '$')}}`}
                style={styles.defaultColorTheme}
            />
            <Text>Raw</Text>
            <MathItem
                math={processString}
                style={styles.defaultColorTheme}
            />
        </View>
    );
}