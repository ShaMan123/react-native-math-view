
import * as _ from 'lodash';
import React, { useCallback } from 'react';
import { Dimensions, Text, YellowBox } from 'react-native';
import MathItem from './MathItem';
import MathSectionList from './MathSectionList';
import styles from './styles';

YellowBox.ignoreWarnings(['Warning: `flexWrap: `wrap`` is not supported with the `VirtualizedList` components.']);

export default function FlexWrapMathSectionList() {
    const renderHeader = useCallback(({ section: { title } }) => {
        return (
            <Text
                style={styles.sectionHeader}
            >
                {title}
            </Text>
        );
    }, []);

    const renderItem = useCallback(({ item }) => {
        return (
            <MathItem
                math={item}
                resizeMode='contain'
                containerStyle={[styles.flexWrapContainer]}
                //style={{/*maxWidth:200, minHeight:50,*/ flexWrap: 'wrap' }}
            //scaleToFit={false}
            />
        );
    }, []);

    return (
        <MathSectionList
            style={styles.default}
            contentContainerStyle={{ flexWrap: 'wrap', display: 'flex', flexDirection: 'row' }}
            renderSectionHeader={renderHeader}
            renderItem={renderItem}
        />
    );
}