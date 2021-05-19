import _ from "lodash";
import React, { useEffect } from "react";
import { StyleProp, StyleSheet, Text, TextStyle, View, ViewProps, ViewStyle } from "react-native";
import { MathToSVGConfig } from "./mathjax/Config";

export type ResizeMode = 'cover' | 'contain';

export interface MathViewCommonProps extends ViewProps {
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
    renderError?: React.FC<MathViewErrorProps> | React.ReactElement<MathViewErrorProps>

    onError?: (error: Error) => any

    /**Verbose option for debugging, disabled in production */
    debug?: boolean
}

export interface MathViewProps extends MathViewCommonProps {
    /**
     * see the list of LaTeX commands:
     * http://docs.mathjax.org/en/latest/input/tex/macros/index.html
     * */
    math: string,
}

export interface ParserResponse {
    svg: string,
    size: {
        width: number,
        height: number
    }
}

export interface MathViewInjectedProps extends MathViewCommonProps, ParserResponse { }

export enum MathError {
    parsing = "MATH_ERROR/PARSING"
}

export interface MathViewErrorProps extends MathViewProps {
    error: Error
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