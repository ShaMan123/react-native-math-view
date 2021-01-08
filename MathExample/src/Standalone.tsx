
import * as _ from 'lodash';
import React, { useContext, useMemo } from 'react';
import { View } from 'react-native';
import AppContext from './Context';
import MathStrings from './math';
import MathItem from './MathItem';
import styles from './styles';

const allMath = _.flatten(_.values(MathStrings));
export default function Standalone() {
    const curr = useContext(AppContext).inc;
    const tag = useMemo(() => allMath[curr % allMath.length], [curr]);

    return (
        <View style={[styles.default, styles.centerContent]}>
            <MathItem
                math={tag}
                style={styles.defaultColorTheme}
                config={{ inline: false }}
            />
        </View>
    );
}