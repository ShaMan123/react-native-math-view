
import React, { useEffect, useMemo } from 'react';
import { Animated, TouchableOpacity, TouchableOpacityProps, ViewProps } from 'react-native';
import MathView, { MathViewProps } from 'react-native-math-view/src';
import { useColor } from './Hooks';
import styles from './styles';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

function MathItem(props: MathViewProps & TouchableOpacityProps & { containerStyle?: ViewProps['style'] }) {
    const color = useColor();

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
            {...props}
            style={[props.containerStyle, /*{ opacity }*/]}
        >
            <MathView
                //color={parsedColor()} // can set color in style or directly
                resizeMode='contain'
                style={{ color }} // can use color prop instead
                {...props}
            />
        </AnimatedTouchable>
    );
}

MathItem.defaultProps = {
    containerStyle: styles.flexContainer
}

export default MathItem;