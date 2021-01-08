
import * as _ from 'lodash';
import React, { useContext, useMemo } from 'react';
import { View, Text, I18nManager, LogBox } from 'react-native';
import AppContext from './Context';
import MathStrings from './math';
import MathItem from './MathItem';
import styles from './styles';
import { TouchableOpacity, FlatList, ScrollView } from 'react-native-gesture-handler';
import { MathText } from 'react-native-math-view';

const processString0 = `When $a \\ne 0$, there are two solutions \nto $ax^2 + bx + c = 0$ and they are $$x_{1,2} = {-b \\pm \\sqrt{b^2-4ac} \\over 2a}.$$`;
let processString = `$$\\sum_{n=0}^\\infty$$ This text includes math notations such as $\\sum_{n=0}^\\infty$ and should be wrapped correctly for \\( \\alpha \\) and $\\beta$ within the view. \nThe following formula shouldn't be inline:$$x_{1,2} = {-b \\pm \\sqrt{b^2-4ac} \\over 2a}$$However the following formula should be inline with the text: \\( a^2 + b^2 = c^2 \\)`;
const processString1 = `hello world! I'm trying to understand why $ $flex wrap styling messes up text vertical alignment`;

const allMath = _.flatten(_.values(MathStrings));

LogBox.ignoreLogs(['VirtualizedLists should never be nested inside plain ScrollViews with the same orientation - use another VirtualizedList-backed container instead.'])

function InlineItem({ value, isMath, inline }: { value: string, isMath: boolean, inline?: boolean }) {
    if (value === '') return null;
    return isMath ?
        <MathItem
            key={value}
            math={_.trim(value)}
            color="cyan"
            style={styles.defaultColorTheme}
            containerStyle={[styles.inlineContainer]}
            config={{ inline: typeof inline === 'boolean' ? inline : false }}
        /> :
        <TouchableOpacity
            style={[styles.default, styles.centerContent]}
            key={value}
        >

            <Text style={[styles.defaultColorTheme, { fontSize: 16, fontStyle: 'italic', textAlignVertical: 'center' }]}>{_.trim(value)}</Text>
        </TouchableOpacity>

}

function MathRow({ value, isMath }: { value: string, isMath: boolean }) {
    const parts = useMemo(() => _.flatten(_.map(_.split(value, /\$+/g), (value, i) => {
        if (isMath || i % 2 === 1) {
            return [{ value, isMath: true, inline: !isMath }];
        } else {
            return _.map(_.split(_.trim(value), ' '), value => ({ value, isMath: false, inline: true }));
        }
    })), [value, isMath]);
    return (
        <View
            style={[styles.diverseContainer]}
        >
            {
                _.map(parts, ({ value, isMath, inline }, i) => {
                    const el = <InlineItem value={value} isMath={isMath} inline={inline} key={`${value}${i}`} />;
                    if (i === parts.length - 1) return el;
                    return React.cloneElement(<>{el}<Text> </Text></>, { key: `space${i}` });
                })
            }
        </View>
    )
}

export default function Composition() {
    const { switch: mode, inc } = useContext(AppContext);
    const value = inc % 2 === 0 ? _.replace(processString, /\n/g, '') : processString;
    return (
        <ScrollView style={[styles.default, { backgroundColor: 'pink' }]}>
            <Text>Compose with MathText</Text>
            <MathText
                style={styles.defaultColorTheme}
                value={value}
                direction="ltr"
                CellRendererComponent={<TouchableOpacity style={styles.defaultColorTheme} />}
                renderItem={inc % 3 === 0 ? (props) => <InlineItem {...props} /> : undefined}
            />
            <Text>Use MathText for single math notation</Text>
            <MathText
                style={styles.defaultColorTheme}
                math={"x_{1,2} = {-b \\pm \\sqrt{b^2-4ac} \\over 2a}"}
                direction="ltr"
                CellRendererComponent={<TouchableOpacity style={styles.defaultColorTheme} />}
                renderItem={inc % 3 === 0 ? (props) => <InlineItem {...props} /> : undefined}
            />
            <Text>Inline vs. Not</Text>
            <MathText
                style={styles.defaultColorTheme}
                value="$\sum_{n=0}^\infty$ $$\sum_{n=0}^\infty$$"
                direction="ltr"
                containerStyle={[styles.centerContent]}
                CellRendererComponent={<TouchableOpacity style={styles.defaultColorTheme} />}
            />
            <Text>Compose with FlatList</Text>
            <View>
                <FlatList
                    data={_.flatten(_.map(_.split(_.replace(value, /\\(\(|\))/g, '$'), '\n'), (val) => {
                        const parts = _.split(val, '$$');
                        return _.map(parts, (part, index) => ({ value: part, isMath: index % 2 === 1 }));
                    }))}
                    renderItem={({ item }) => <MathRow {...item} />}
                    keyExtractor={(item, index) => `${item.value}${index}`}
                    contentContainerStyle={[{ flexWrap: 'wrap', display: 'flex', alignItems: 'center' }, styles.flexLeft]}
                    style={styles.defaultColorTheme}
                />
            </View>
            <Text>Split input, wrap text with op \\text{ }</Text>
            <MathText
                value={value}
                renderRow={({ isMath, value }) => {
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
            <MathItem
                math={`${_.replace(processString, /\n+/g, '$$')}`}
                style={styles.defaultColorTheme}
            />
            <Text>Raw</Text>
            <MathItem
                math={processString}
                style={styles.defaultColorTheme}
                config={{ inline: false }}
            />
            <MathItem
                math="When $a \ne 0$, there are two solutions to \(ax^2 + bx + c = 0\) and they are $$x = {-b \pm \sqrt{b^2-4ac} \over 2a}.$$"
            />
        </ScrollView>
    );
}