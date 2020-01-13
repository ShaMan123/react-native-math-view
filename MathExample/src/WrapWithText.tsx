
import * as _ from 'lodash';
import React, { useContext, useMemo } from 'react';
import { View, Text, I18nManager, YellowBox } from 'react-native';
import AppContext from './Context';
import MathStrings from './math';
import MathItem from './MathItem';
import styles from './styles';
import { TouchableOpacity, FlatList, ScrollView } from 'react-native-gesture-handler';

const processString = _.replace(`When $a \\ne 0$, there are two solutions 
to \\(ax^2 + bx + c = 0\\) and they are $$x_{1,2} = {-b \\pm \\sqrt{b^2-4ac} \\over 2a}.$$`, /\\(\(|\))/g, '$');
const processString1 = `hello world! I'm trying to understand why $ $flex wrap styling messes up text vertical alignment`;

const allMath = _.flatten(_.values(MathStrings));

YellowBox.ignoreWarnings(['VirtualizedLists should never be nested inside plain ScrollViews with the same orientation - use another VirtualizedList-backed container instead.'])

function InlineItem({ value, isMath }: { value: string, isMath: boolean }) {
    if (value === '') return null;
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

            <Text style={[styles.defaultColorTheme, { fontSize: 16, fontStyle: 'italic', textAlignVertical: 'center' }]}>{value}</Text>
        </TouchableOpacity>

}

function MathParagraph({ math, renderRow }: { math: string, renderRow: (value: string, isMath: boolean) => JSX.Element }) {
    const statements = _.split(math, /\$\$/g);
    const bits = _.split(math, /\n|{\$\$}/g);
    return (
        <View
            style={[styles.defaultColorTheme, { alignItems: 'flex-end' }]}
        >
            {
                _.map(statements, (value, i) => {
                    if (value === '') return null;
                    const isMath = i % 2 === 1;
                    return _.map(_.split(value, /\n/g), (val, index) => React.cloneElement(renderRow(val, isMath), { key: value + i + index }))
                })
            }
        </View>
    );
}


export default function Composition() {
    return (
        <ScrollView style={[styles.default, { backgroundColor: 'pink' }]}>
            <Text>Compose with Text & MathView</Text>
            <MathParagraph
                math={processString}
                renderRow={(value, isMath) => {
                    return (
                        <View
                            style={[styles.diverseContainer]}
                        >
                            {
                                _.map(_.split(value, /\$+/g), (value, i) => {
                                    return <InlineItem value={value} isMath={isMath || i % 2 === 1} key={`${value}${i}`} />
                                })
                            }
                        </View>
                    )
                }}
            />

            <Text>Compose with FlatList</Text>
            <View>
                <FlatList
                    data={_.split(_.replace(processString, /\n+/g, '$$ $$'), /\$+/g)}
                    renderItem={({ index, item }) => <InlineItem value={item} isMath={index % 2 === 1} />}
                    keyExtractor={(item, index) => `${item}${index}`}
                    contentContainerStyle={[{ flexWrap: 'wrap', display: 'flex', alignItems: 'center' }, styles.flexLeft]}
                    style={styles.defaultColorTheme}
                />
            </View>
            <Text>Split input, wrap text with op \\text{}</Text>
            <MathParagraph
                math={processString}
                renderRow={(value, isMath) => {
                    return (
                        <MathItem
                            key={value}
                            math={isMath ? value : `\\text{${value}}`}
                            style={styles.defaultColorTheme}
                            containerStyle={[styles.flexContainer, { margin: 0, alignItems: 'flex-start' }]}
                        />
                    )
                }}
            />
            <Text>Inline</Text>
            <MathItem
                math={`\\text{${_.replace(_.replace(processString, /\n+/g, '$$ $$'), /\$\$/g, '$')}}`}
                style={styles.defaultColorTheme}
            />
            <Text>Raw</Text>
            <MathItem
                math={processString}
                style={styles.defaultColorTheme}
            />
        </ScrollView>
    );
}