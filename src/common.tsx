import React from "react";
import { StyleProp, StyleSheet, Text, View, ViewProps, ViewStyle } from "react-native";
import { MathToSVGConfig } from "./mathjax";

export type ResizeMode = 'cover' | 'contain';

export interface MathViewProps extends ViewProps {
    /**
     * see the list of LaTeX commands:
     * http://docs.mathjax.org/en/latest/input/tex/macros/index.html
     * */
    math: string,

    /**
     * set text color
     * can be set via `setNativeProps` or passed via `style`
     * */
    color?: string,
    style?: StyleProp<ViewStyle & { color: string | any }>

    /**
     * defaults to 'center'
     * */
    resizeMode?: ResizeMode,

    /**MathJax config object */
    config?: Partial<MathToSVGConfig>,

    /**Fallback component that will be rendered if a parsing error occurs */
    renderError?: React.FC<MathViewErrorProps> | JSX.Element
}

export interface MathViewErrorProps extends MathViewProps {
    error: string
}

export const styles = StyleSheet.create({
    container: {
        //flexDirection: 'row',
        display: 'flex',
        minHeight: 35
    },
    contain: {
        maxWidth: '100%',
        maxHeight: '100%'
    },
    error: {
        fontWeight: 'bold'
    },
    multilineText: {
        display: 'flex',
        flexDirection: 'column'
    }
});

export const ErrorComponent = (props: MathViewErrorProps) => <View style={[props.style, styles.multilineText]}>
    <Text style={props.style}>{props.math}</Text>
    <Text style={[props.style, styles.error]}>{props.error}</Text>
</View>;