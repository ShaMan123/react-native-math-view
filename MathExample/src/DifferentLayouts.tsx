
import _ from 'lodash';
import React, { useContext } from 'react';
import { ScrollView, Text, View } from 'react-native';
import AppContext from './Context';
import { chemistry, getFrac, getRecursiveFrac, getTaylor } from './math';
import MathItem from './MathItem';
import styles from './styles';

export default function DifferentLayouts() {
    const curr = useContext(AppContext).inc % 20;

    const taylor = getTaylor(curr);
    const rFrac = getRecursiveFrac(curr);
    const frac = getFrac(`x+${curr + 1}`, curr + 1);

    return (
        <View
            style={styles.default}
        >
            <ScrollView style={styles.default}>
                <View
                    style={styles.default}
                >
                    <Text>resizeMode: 'contain'</Text>
                    <MathItem
                        math={taylor}
                        style={styles.defaultColorTheme}
                    />
                </View>
                <Text>resizeMode: 'center'</Text>
                <MathItem
                    math={taylor}
                    style={styles.defaultColorTheme}
                    resizeMode='cover'
                />
                <Text>resizeMode: 'cover'</Text>
                <View>
                    <ScrollView
                        horizontal
                        style={styles.default}
                        scrollEnabled
                    //onScroll={e => console.log(e.nativeEvent)}
                    >
                        <MathItem
                            math={taylor}
                            style={[styles.defaultColorTheme, styles.default]}
                            resizeMode='cover'
                        />
                    </ScrollView>
                </View>
                <Text>resizeMode: 'stretch'</Text>
                <MathItem
                    math={taylor}
                    resizeMode='cover'
                    style={[{ minHeight: 150, flex: 1 }, styles.defaultColorTheme]}
                />
                <View style={{ width: 200, height: 200, justifyContent: 'center', alignItems: 'stretch', borderColor: 'pink', borderWidth: 2, borderStyle: 'dashed', margin: 5 }} collapsable={false}>
                    <MathItem
                        math={frac}
                        style={styles.defaultColorTheme}
                        resizeMode='cover'
                    />
                </View>
                <Text>resizeMode: 'contain'</Text>
                <MathItem
                    math={rFrac}
                    style={styles.defaultColorTheme}
                    config={{ ex: 50, em: 200, }}
                />
                <Text>resizeMode: 'cover'</Text>
                <MathItem
                    math={rFrac}
                    style={styles.defaultColorTheme}
                    resizeMode='cover'
                />
                <Text>resizeMode: 'stretch'</Text>
                <MathItem
                    math={rFrac}
                    style={[styles.defaultColorTheme, { minHeight: 300, flex: 1 }]}
                    resizeMode='cover'
                />
                <Text>chem: not fully supported</Text>
                <MathItem
                    math={_.last(chemistry)}
                    style={[styles.defaultColorTheme, { flex: 1, minHeight: 200 }]}
                    resizeMode='contain'
                />
            </ScrollView>
        </View>
    );
}
