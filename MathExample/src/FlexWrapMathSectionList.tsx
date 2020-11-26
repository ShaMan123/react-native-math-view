
import React, { useCallback, useContext } from 'react';
import { LogBox, Text } from 'react-native';
import AppContext from './Context';
import MathItem from './MathItem';
import MathSectionList from './MathSectionList';
import styles from './styles';

LogBox.ignoreLogs(['Warning: `flexWrap: `wrap`` is not supported with the `VirtualizedList` components.']);

export default function FlexWrapMathSectionList() {
    const { inc } = useContext(AppContext);

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
            />
        );
    }, []);



    return (
        <MathSectionList
            style={styles.default}
            contentContainerStyle={{ flexWrap: 'wrap', display: 'flex', flexDirection: 'row' }}
            renderSectionHeader={renderHeader}
            renderItem={renderItem}
            extraData={inc}
        />
    );
}