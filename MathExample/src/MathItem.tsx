
import React, { useMemo, useEffect } from 'react';
import { TouchableOpacity, StyleSheet, Animated } from 'react-native';
import MathView, { MathViewProps } from 'react-native-math-view';
import styles from './styles';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

function MathItem(props: MathViewProps) {
    const getColor = () => Math.round(Math.random() * 255);
    const getPixel = () => [getColor(), getColor(), getColor()].join(',');
    const parsedColor = () => `rgb(${getPixel()})`;

    const opacity = useMemo(() => new Animated.Value(0), []);
    useEffect(() => {
        Animated
            .timing(opacity, {
                toValue: 1,
                useNativeDriver: true
            })
            .start();
    }, []);
    
    return (
        <AnimatedTouchable
            style={[props.containerStyle, /*{ opacity }*/]}
        >
            <MathView
                //color={parsedColor()} // can set color in style or directly
                scaleToFit
                resizeMode='contain'
                style={{ color: parsedColor() }} // can use color prop instead
                {...props}
            />
        </AnimatedTouchable>
    );
}

MathItem.defaultProps = {
    containerStyle: styles.flexContainer
}

export default MathItem;