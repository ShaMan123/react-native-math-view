import { useEffect, useMemo, useState, useContext } from "react";
import { Animated } from "react-native";
import AppContext from "./Context";

const interval = 500;

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

const getColor = () => Math.round(Math.random() * 255);
const getPixel = () => [getColor(), getColor(), getColor()].join(',');
export const color = () => `rgb(${getPixel()})`;
export function useColor() {
    const context = useContext(AppContext);
    const start = useMemo(() => color(), [])
    return useMemo(() => context.switch ? color() : start, [context.switch, context.inc]);
    //return useMemo(() => color(), [context.switch]);
}