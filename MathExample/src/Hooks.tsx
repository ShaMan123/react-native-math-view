import { useEffect, useMemo, useState } from "react";
import { Animated } from "react-native";

const interval = 3000;

export function useWidth(switchValue: boolean, animated: boolean = false) {
    const [width, setWidth] = useState(1);
    //const context = useContext(AppContext);
    //switchValue = switchValue || context.switch;

    const widthAnimatedValue = useMemo(() => new Animated.Value(1), []);
    
    let i = 0;
    useEffect(() => {
        const t = setInterval(() => {
            i++;
            if (switchValue) {
                const val = (i % 4 + 1) * 0.25;
                animated ? widthAnimatedValue.setValue(val) : setWidth(val);
            }
        }, interval);

        return () => clearInterval(t);
    }, [switchValue]);

    return animated ?
        widthAnimatedValue.interpolate({
            inputRange: [0, 1],
            outputRange: ['0%', '100%']
        }) :
        `${width * 100}%`;
}

export function useInc(switchValue: boolean) {
    const [curr, setCurr] = useState(0);
    useEffect(() => {
        const t = setInterval(() => {
            switchValue && setCurr(curr + 1);
        }, interval);

        return () => clearInterval(t);
    }, [curr, switchValue]);

    return curr;
}