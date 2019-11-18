
import * as _ from 'lodash';
import React, { useContext, useMemo } from 'react';
import { View } from 'react-native';
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
            <MathViewFallback
                math={tag}
                style={[styles.defaultColorTheme, styles.default, { maxWidth: '100%' }]}
            />
        </View>
    );
}