
import * as _ from 'lodash';
import React, { useCallback, useState, useEffect } from 'react';
import { SectionList, SectionListProps, Text, SectionListData, Dimensions } from 'react-native';
import MathStrings from './math';
import MathItem from './MathItem';
import styles from './styles';

const interval = 3000;

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
    
    const [width, setWidth] = useState(Dimensions.get('window').width);
    let i = 0;
    useEffect(() => {
        i++;
        const t = setInterval(() => {
            setWidth(Math.min(Dimensions.get('window').width * (i % 4 + 1) * 0.25, Dimensions.get('window').width))
        }, interval);

        return () => clearInterval(t);
    }, []);
    
    return (
        <SectionList
            renderItem={({ item, index, section }) => <MathItem math={item} style={{flex:1}} />}
            renderSectionHeader={({ section: { title } }) => <Text style={styles.sectionHeader}>{title}</Text>}
            sections={sections}
            onRefresh={onRefresh}
            refreshing={refreshing}
            style={{ flex: 1/*, maxWidth: this.state.width*/ }}
            {...props}
            //contentContainerStyle={{flex:1}}
            extraData={width}
        />
    );
}