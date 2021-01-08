
import _ from 'lodash';
import React, { useMemo } from 'react';
import { FlatList, I18nManager, StyleProp, StyleSheet, Text, TextProps, View, ViewStyle } from 'react-native';
import { MathViewProps } from './common';
//@ts-ignore
import MathView from './MathView';

type ElementOrRenderer<T = {}> = ((props: T) => JSX.Element) | JSX.Element

export type Direction = 'ltr' | 'rtl' | 'auto';

export type MathTextRenderingProps = {
    value: string,
    isMath: boolean
}

export type MathTextItemProps<T extends boolean = any> = (T extends true ? Omit<MathViewProps, 'math'> : TextProps) & {
    value: string,
    isMath: T,
    CellRendererComponent?: ElementOrRenderer
}

export type MathTextRowProps = MathTextItemProps & {
    direction?: Direction,
    containerStyle?: StyleProp<ViewStyle>,
    index: number,
    renderItem?: (props: MathTextRenderingProps & { index: number, rowIndex: number }) => JSX.Element
}

export type MathTextProps = Pick<MathTextRowProps, 'direction' | 'containerStyle' | 'renderItem' | 'CellRendererComponent'> & {
    value: string,
    style?: StyleProp<ViewStyle>,
    renderRow?: (props: MathTextRenderingProps & { index: number }) => JSX.Element
}

export const InlineMathItem = React.memo(({ value, isMath, CellRendererComponent, ...props }: MathTextItemProps) => {
    if (value === '') return null;
    const el = isMath ?
        <MathView
            {...props}
            math={value}
            resizeMode='contain'
        /> :
        <Text
            {...props}
            style={[styles.textMiddle, props.style]}
        >
            {value}
        </Text>;
    const container = typeof CellRendererComponent === 'function' ? <CellRendererComponent /> : CellRendererComponent || <></>;
    return React.cloneElement(container, { style: [styles.centerContent, container.props?.style] }, el);
});

export const MathTextRow = React.memo(({ value, isMath, direction, containerStyle, CellRendererComponent, renderItem, index, ...props }: MathTextRowProps) => {
    const parts = useMemo(() => _.flatten(_.map(_.split(value, /\$+/g), (value, i) => {
        if (isMath || i % 2 === 1) {
            return [{ value, isMath: true }];
        } else {
            return _.map(_.split(_.trim(value), ' '), value => ({ value, isMath: false }));
        }
    })), [value, isMath]);
    const Renderer = renderItem || InlineMathItem;
    return (
        <View
            style={[
                styles.diverseContainer,
                direction === 'ltr' ? styles.flexLeft : direction === 'rtl' ? styles.flexRight : null,
                containerStyle
            ]}
        >
            {
                _.map(parts, ({ value, isMath }, i) => {
                    const el = <Renderer
                        {...props}
                        value={value}
                        isMath={isMath}
                        CellRendererComponent={CellRendererComponent}
                        index={i}
                        rowIndex={index}
                    />;
                    return React.cloneElement(i === parts.length - 1 ? el : <>{el}<Text> </Text></>, { key: `InlineMath.${value}.${i}` });
                })
            }
        </View>
    )
});

const MathText = React.memo(({ value, renderRow, style, ...props }: MathTextProps) => {
    const statements = useMemo(() => _.split(_.replace(value, /\\(\(|\))/g, '$'), /\$\$/g), [value]);
    const Container = renderRow || MathTextRow;

    return (
        <View style={style}>
            {
                _.map(statements, (value, i) => {
                    if (value === '') return null;
                    const isMath = i % 2 === 1;
                    return _.map(_.split(value, /\n/g), (val, index) =>
                        <Container
                            {...props}
                            key={`${value}.${i}.${index}`}
                            value={val}
                            isMath={isMath}
                            index={i}
                        />
                    )
                })
            }
        </View>
    );
});

export default MathText;

const styles = StyleSheet.create({
    centerContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    flexLeft: {
        flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row'
    },
    flexRight: {
        flexDirection: I18nManager.isRTL ? 'row' : 'row-reverse'
    },
    diverseContainer: {
        flexWrap: 'wrap',
        display: 'flex',
        flexDirection: 'row',
        marginVertical: 10
    },
    textMiddle: {
        textAlignVertical: 'center'
    }
});