
import React, { forwardRef, useEffect, useMemo } from 'react';
import { Animated, TouchableOpacityProps, ViewProps } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import MathView, { MathViewProps } from 'react-native-math-view';
import { useColor } from './Hooks';
import styles from './styles';

const MathItem = forwardRef((props: MathViewProps & TouchableOpacityProps & { containerStyle?: ViewProps['style'] }, ref: any) => {
    const color = useColor();
    /*
        const opacity = useMemo(() => new Animated.Value(0), []);
        useEffect(() => {
            Animated
                .timing(opacity, {
                    toValue: 1,
                    useNativeDriver: true
                })
                .start();
        }, []);
    */
    return (
        <TouchableOpacity
            {...props}
            style={[props.containerStyle, /*{ opacity }*/]}
        //activeOpacity={0.2}
        >
            <MathView
                //color={parsedColor()} // can set color in style or directly
                resizeMode='contain'
                style={{ color }} // can use color prop instead
                {...props}
                ref={ref}
            //config={{ ex: 50 }}
            />
        </TouchableOpacity>
    );
});

MathItem.defaultProps = {
    containerStyle: styles.flexContainer
}

export default MathItem;