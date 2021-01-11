
import * as _ from 'lodash';
import React, { useContext, useMemo } from 'react';
import { Text, View } from 'react-native';
import AppContext from './Context';
import MathStrings from './math';
import MathViewFallback from 'react-native-math-view/src/fallback';
import styles from './styles';

const allMath = _.flatten(_.values(MathStrings));
export default function SvgXml() {
    const curr = useContext(AppContext).inc;
    const tag = useMemo(() => allMath[curr % allMath.length], [curr]);

    return (
        <View style={[styles.default, styles.centerContent]}>
            <View style={[styles.centerContent, styles.defaultColorTheme]}>
                <MathViewFallback
                    config={{ inline: false }}
                    math={tag}
                    style={[styles.defaultColorTheme, { marginVertical: 10 }]}
                    resizeMode="cover"
                    renderError={({ error }) => <Text style={[styles.defaultColorTheme, { marginVertical: 10 }, { fontWeight: 'bold' }]}>{error}</Text>}
                />
            </View>
        </View>
    );
}