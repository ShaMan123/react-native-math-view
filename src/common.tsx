import _ from "lodash";
import React from "react";
import { StyleProp, StyleSheet, Text, TextStyle, View, ViewProps, ViewStyle } from "react-native";
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
    style?: StyleProp<ViewStyle & Pick<TextStyle, 'color'>>

    /**
     * defaults to 'center'
     * */
    resizeMode?: ResizeMode,

    /**MathJax config object */
    config?: Partial<MathToSVGConfig>,

    /**Fallback component that will be rendered if a parsing error occurs */
    renderError?: React.FC<MathViewErrorProps> | JSX.Element
}

export enum MathError {
    parsing = "MATH_ERROR/PARSING"
}

export interface MathViewErrorProps extends MathViewProps {
    error: string
}

export const ErrorComponent = (props: MathViewErrorProps) => <View style={[props.style, styles.multilineText]}>
    <Text style={props.style}>{props.math}</Text>
    <Text style={[props.style, styles.error]}>{props.error}</Text>
</View>;

export function mathErrorBoundary(error: Error, props: MathViewProps) {
    if (_.every(_.values(MathError), enumo => enumo !== error.name)) throw error;
    const { renderError: Fallback } = props;
    return typeof Fallback === 'function' ?
        <Fallback
            error={`${error.message}`}    //escape backslash "\" used in LaTex 
            {...props}
        /> :
        React.isValidElement(Fallback) ?
            Fallback :
            null;
}

export const getPreserveAspectRatio = (alignment: string, scale: string) => `${alignment} ${scale}`;

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