
import _ from 'lodash';
import React, { useMemo } from 'react';
import { I18nManager, StyleProp, StyleSheet, Text, TextProps, View, ViewStyle } from 'react-native';
import { MathViewProps } from './common';
//@ts-ignore
import MathView from './MathView';

type ElementOrRenderer<T = {}> = ((props: T) => JSX.Element) | JSX.Element

export type Direction = 'ltr' | 'rtl' | 'auto';

export type MathTextRowRenderingProps = {
    value: string,
    isMath: boolean,
    index: number
};

export type MathTextItemRenderingProps = MathTextRowRenderingProps & { rowIndex: number, inline: boolean };

export type MathTextItemProps<T extends boolean = boolean> = (T extends true ? Omit<MathViewProps, 'math'> : TextProps) & {
    value: string,
    isMath: T,
    Component?: MathView,
    CellRendererComponent?: ElementOrRenderer,
    inline?: boolean
}

export type MathTextRowProps = MathTextItemProps & {
    direction?: Direction,
    containerStyle?: StyleProp<ViewStyle>,
    index: number,
    renderItem?: (props: MathTextItemRenderingProps) => JSX.Element
}

export type MathTextProps = Pick<MathTextRowProps, 'direction' | 'containerStyle' | 'renderItem' | 'CellRendererComponent'> & {
    value?: string,
    math?: string,
    style?: StyleProp<ViewStyle>,
    renderRow?: (props: MathTextRowRenderingProps) => JSX.Element
}

export const InlineMathItem = React.memo(({ value, isMath, CellRendererComponent, Component, inline, ...props }: MathTextItemProps) => {
    if (value === '') return null;
    const config = useMemo(() => ({ inline }), [inline]);
    const Renderer = Component || MathView;
    const el = isMath ?
        <Renderer
            {...props}
            math={value}
            resizeMode='contain'
            config={config}
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
            return [{ value, isMath: true, inline: !isMath }];
        } else {
            return _.map(_.split(_.trim(value), ' '), value => ({ value, isMath: false, inline: true }));
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
                _.map(parts, ({ value, isMath, inline }, i) => {
                    const el = <Renderer
                        {...props}
                        value={value}
                        isMath={isMath}
                        inline={inline || false}
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

const MathText = React.memo(({ value, renderRow, style, math, ...props }: MathTextProps) => {
    if (__DEV__ && value && math) {
        console.warn('MathText has received both `value` and `math` props');
    } else if (!value && !math) {
        __DEV__ && console.warn('MathText: please provide `value` or `math` prop');
        return null;
    }
    const statements = useMemo(() => _.split(_.replace(value || `$${math}$`, /\\(\(|\))/g, '$'), /\$\$/g), [value]);
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