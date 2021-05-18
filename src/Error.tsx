import _ from "lodash";
import React, { useEffect } from "react";
import { Text, View } from "react-native";
import { MathError, MathViewErrorProps, MathViewProps, styles } from "./common";

export const ErrorComponent = (props: MathViewErrorProps) => <View style={[props.style, styles.multilineText]}>
    <Text style={props.style}>{props.math}</Text>
    <Text style={[props.style, styles.error]}>{props.error}</Text>
</View>;

export const MathErrorBoundary = React.memo((props: MathViewProps & { error: Error }) => {
    const { error, renderError: Fallback, onError } = props;
    if (_.every(_.values(MathError), enumo => enumo !== error.name)) throw error;
    useEffect(() => {
        if (onError) {
            onError(error);
        } else if (!Fallback && __DEV__) {
            console.warn('react-native-math-view: Parsing Error', error);
        }
    }, [error]);
    return typeof Fallback === 'function' ?
        <Fallback
            {...props}
        /> :
        React.isValidElement(Fallback) ?
            React.cloneElement(Fallback, { error }) :
            null;
});
