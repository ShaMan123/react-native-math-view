
import * as _ from 'lodash';
import React, { useCallback, useState, useEffect, useContext } from 'react';
import { SectionList, SectionListProps, Text, SectionListData, Dimensions, Animated } from 'react-native';
import MathStrings from './math';
import MathItem from './MathItem';
import styles from './styles';
import { useWidth } from './Hooks';
import AppContext from './Context';

export default function MathSectionList(props: Partial<SectionListProps<typeof MathStrings>> = {}) {
    const [sections, setSections] = useState(_.map(MathStrings, (group, key) => {
        return {
            title: key,
            data: group,
            keyExtractor: (item) => `${key}:${item}`
        } as SectionListData<string>
    }));

    const [refreshing, setRefreshing] = useState(false);
    const onRefresh = useCallback(() => {
        setRefreshing(true);
        setSections(_.map(sections, (sec) => _.set(sec, 'data', _.reverse(sec.data))));
    }, [sections]);

    useEffect(() => {
        refreshing && setRefreshing(false);
    }, [refreshing]);

    const { width } = useContext(AppContext);
    
    return (
        <Animated.SectionList
            renderItem={({ item, index, section }) => <MathItem math={item} />}
            renderSectionHeader={({ section: { title } }) => <Text style={styles.sectionHeader}>{title}</Text>}
            sections={sections}
            onRefresh={onRefresh}
            refreshing={refreshing}
            style={[{ flex: 1, maxWidth: width }]}
            extraData={width}
            {...props}
        />
    );
}