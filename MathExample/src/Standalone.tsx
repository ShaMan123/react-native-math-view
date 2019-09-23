
import * as _ from 'lodash';
import React, { useEffect, useMemo, useState } from 'react';
import { View } from 'react-native';
import MathStrings from './math';
import MathItem from './MathItem';

const interval = 3000;

const allMath = _.flatten(_.values(MathStrings));
export default function Standalone() {
    const [curr, setCurr] = useState(0);
    const tag = useMemo(() => allMath[curr % allMath.length], [curr]);
    useEffect(() => {
        const t = setInterval(() => {
            setCurr((curr + 1) % 20);
        }, interval);

        return () => clearInterval(t);
    }, [curr]);

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