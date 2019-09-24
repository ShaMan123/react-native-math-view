
import * as _ from 'lodash';
import React, { useContext, useMemo } from 'react';
import { View } from 'react-native';
import AppContext from './Context';
import MathStrings from './math';
import MathItem from './MathItem';

const allMath = _.flatten(_.values(MathStrings));
export default function Standalone() {
    const curr = useContext(AppContext).inc;
    const tag = useMemo(() => allMath[curr % allMath.length], [curr]);

    return (
        <View style={{ flex: 1, justifyContent: 'center' }}>
            <MathItem
                math={tag}
                backgroundColor='blue'
                color='white'
            />
        </View>
    );
}