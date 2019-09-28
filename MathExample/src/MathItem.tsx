
import React, { useEffect, useMemo, forwardRef } from 'react';
import { Animated, TouchableOpacityProps, ViewProps } from 'react-native';
import MathView, { MathViewProps } from 'react-native-math-view/src';
import { useColor } from './Hooks';
import styles from './styles';
import { TouchableHighlight, TouchableOpacity } from 'react-native-gesture-handler';

function MathItem(props: MathViewProps & TouchableOpacityProps & { containerStyle?: ViewProps['style'] }, ref: any) {
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
            />
        </TouchableOpacity>
    );
}

const MathItemWrapper = forwardRef(MathItem);

MathItemWrapper.defaultProps = {
    containerStyle: styles.flexContainer
}

export default MathItemWrapper;