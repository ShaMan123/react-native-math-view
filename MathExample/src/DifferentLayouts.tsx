
import React, { useEffect, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import MathItem from './MathItem';
import { chemistry, getTaylor, getFrac, getRecursiveFrac } from './math';
import _ from 'lodash';
import styles from './styles';

const interval = 3000;

export default function DifferentLayouts() {
    const [curr, setCurr] = useState(0);
    useEffect(() => {
        const t = setInterval(() => {
            setCurr((curr + 1) % 20);
        }, interval);

        return () => clearInterval(t);
    }, [curr]);

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
                        backgroundColor='blue'
                        color='white'
                        scaleToFit={true}
                        resizeMode='contain'
                    />
                </View>
                <Text>resizeMode: 'center'</Text>
                <MathItem
                    math={taylor}
                    backgroundColor='blue'
                    color='white'
                    scaleToFit={false}
                    resizeMode='center'
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
                            backgroundColor='blue'
                            color='white'
                            scaleToFit={false}
                            resizeMode='cover'
                            style={styles.default}
                        />
                    </ScrollView>
                </View>
                <Text>resizeMode: 'stretch'</Text>
                <MathItem
                    math={taylor}
                    backgroundColor='blue'
                    color='white'
                    scaleToFit
                    resizeMode='stretch'
                    style={{ minHeight: 150, flex: 1 }}
                />
                <View style={{ width: 200, height: 200, justifyContent: 'center', alignItems: 'stretch', borderColor: 'pink', borderWidth: 2, borderStyle: 'dashed', margin: 5 }} collapsable={false}>
                    <MathItem
                        math={frac}
                        backgroundColor='blue'
                        color='white'
                        resizeMode='stretch'
                    />
                </View>
                <Text>resizeMode: 'contain'</Text>
                <MathItem
                    math={rFrac}
                    backgroundColor='blue'
                    color='white'
                    scaleToFit
                    resizeMode='contain'
                    config={{ ex: 50, em: 200, }}
                />
                <Text>resizeMode: 'cover'</Text>
                <MathItem
                    math={rFrac}
                    backgroundColor='blue'
                    color='white'
                    scaleToFit={false}
                    resizeMode='cover'
                />
                <Text>resizeMode: 'stretch'</Text>
                <MathItem
                    math={rFrac}
                    backgroundColor='blue'
                    color='white'
                    resizeMode='stretch'
                    style={{ minHeight: 300, flex: 1 }}
                />
                <Text>chem: not fully supported</Text>
                <MathItem
                    math={_.last(chemistry)}
                    backgroundColor='blue'
                    color='white'
                    scaleToFit
                    resizeMode='contain'
                    style={{ flex: 1, minHeight: 200 }}
                />
            </ScrollView>
        </View>
    );
}