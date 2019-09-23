
import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import MathView, { MathViewProps } from 'react-native-math-view';
import styles from './styles';

function MathItem(props: MathViewProps) {
    const getColor = () => Math.round(Math.random() * 255);
    const getPixel = () => [getColor(), getColor(), getColor()].join(',');
    const parsedColor = () => `rgb(${getPixel()})`;
    
    return (
        <TouchableOpacity
            style={props.containerStyle}
        >
            <MathView
                color={parsedColor()}
                scaleToFit
                resizeMode='contain'
                {...props}
            />
        </TouchableOpacity>
    );
}

MathItem.defaultProps = {
    containerStyle: styles.flexContainer
}

export default MathItem;