
import * as _ from 'lodash';
import React, { useState, useCallback, useRef, useMemo, MutableRefObject, useEffect, useImperativeHandle } from 'react';
import { LayoutRectangle, StyleSheet, View, LayoutChangeEvent, Insets, TouchableOpacity, TouchableOpacityProps, GestureResponderEvent, I18nManager, Animated, Text } from 'react-native';
import MathjaxFactory, { MathFragmentResponse } from '../mathjax/MathjaxFactory';
import MathView, { ControlledMathView, MathViewProps } from './MathView';
import HitRectUtil, { defaultHitSlop, MathFragmentRect } from './HitRectUtil';


function useLayout(initial = { x: 0, y: 0, width: 0, height: 0 }) {
    const [layout, setLayout] = useState<LayoutRectangle>(initial);
    const onLayout = useCallback((e: LayoutChangeEvent) => setLayout(e.nativeEvent.layout), []);
    return [layout, onLayout] as [LayoutRectangle, (e: LayoutChangeEvent) => void];
    /*
    const layout = useRef<LayoutRectangle>({ x: 0, y: 0, width: 0, height: 0 });
    const onLayout = useCallback((e: LayoutChangeEvent) => { _.set(layout, 'current', e.nativeEvent.layout) }, []);
    return [layout, onLayout] as [MutableRefObject<LayoutRectangle>, (e: LayoutChangeEvent) => void];
    */
}

interface FragmentedMathViewProps extends MathViewProps {
    hitSlop: number | Insets,
    dev: boolean
}

function FragmentedMathView(props: FragmentedMathViewProps, ref: any) {
    const [layout, onLayout] = useLayout(null);
    //const data = useMemo(() => layout && MathjaxFactory().toSVGArray(props.math), [layout, props.math]);
    const [data, setData] = useState<MathFragmentResponse[]>();
    const hitRectUtil = useMemo(() => new HitRectUtil(), []);

    useEffect(() => {
        if (!layout) return;
        setData(MathjaxFactory().toSVGArray(props.math));
    }, [props.math, layout]);

    useEffect(() => {
        if (layout && data) hitRectUtil.set(layout, data);
    }, [layout, data, hitRectUtil]);

    useEffect(() => {
        hitRectUtil.setHitSlop(props.hitSlop);
    }, [props.hitSlop, hitRectUtil]);

    
    const __ref = useRef();
    const anima = useMemo(() => _.map(new Array(_.size(data)), () => new Animated.Value(1)), [data]);
    const animaF = useMemo(() => _.map(data, ({ viewBox }, i) => {
        if (!layout || !data) return;
        const rect = new MathFragmentRect().setRect(layout, viewBox);
        return Animated.multiply(layout.width * 0.5 - rect.left, Animated.subtract(anima[i], 1));
    }), [layout, data, anima]);

    //console.warn('FragmentedMathView bug intializng ref, unmount and remount and see if you manage to cet the ref')

    useImperativeHandle(ref, () => _.assign({}, __ref.current, {
        test: (x: number, y: number) => hitRectUtil.test(x, y),
        __test: (x: number, y: number) => {
           // console.log(test.current(x, y))

            _.map(hitRectUtil.test(x, y), ({ node, namespace, index, hitResult }) => {
                anima[index].setValue(2);
                Animated.spring(anima[index], { toValue: 1, useNativeDriver: true, delay: 100 }).start();
                console.log(namespace.char)
            });
        },
        __pip() {
            _.map(new Array(data.length), (a, i) => anima[i].setValue(2))
            setTimeout(() => {
                
            }, 200)
            Animated.stagger(
                50,
                _.concat(
                    // _.map(new Array(data.length), (a, i) => Animated.spring(anima[i], { toValue: 2, useNativeDriver: true })),
                    _.map(new Array(data.length), (a, i) => Animated.spring(anima[i], { toValue: 1, useNativeDriver: true, delay:500 })),
                )
            ).start();
        }
    }));
    
    return (
        <Animated.View
            collapsable={false}
            style={styles.flexContainer}
            renderToHardwareTextureAndroid
        >
            <MathView
                {...props}
                //containerStyle={{ backgroundColor: 'red', opacity: 0 }}
                onLayout={onLayout}
                //style={{ color: 'green', backgroundColor: 'red', opacity: 0.3 }}
                ref={__ref}
                
            />

            {layout && data && _.map(data, ({ svg, viewBox, namespace: { char } }, index) => {
                return (
                    <Animated.View
                        pointerEvents='none'
                        key={`MathFragment${index}`}
                        style={[StyleSheet.absoluteFill, styles.flexContainer, { transform: [{ translateX: animaF[index] },{ scale: anima[index] }]}]}
                    >
                        <ControlledMathView
                            {...props}
                            svg={svg}
                            style={{ color: 'blue' }}
                        />

                    </Animated.View>
                );
            })}
            {__DEV__ /*&& props.dev*/ && layout && _.map(data, ({ svg, viewBox, namespace: { char } }, index) => {
                const rect = _.pick(new MathFragmentRect().setRect(layout, viewBox), 'left', 'top', 'right', 'bottom', 'width', 'height')
                console.log(layout, rect)
                return (
                    <View
                        key={`MathFragmentBorder${index}`}
                        style={[StyleSheet.absoluteFill, {
                            borderColor: 'blue',
                            borderWidth: 2,
                            ...rect,
                            opacity: 0.5
                        }]}
                    >
                        <Text>{char}</Text>
                    </View>
                );
                })}
        </Animated.View>
    );
    /*
    return (
        <View style={{ alignItems: 'flex-end', direction: 'ltr' }}>
            <MathItem math={props.math} containerStyle={{ backgroundColor: 'red' }} />

            {_.map(_.reject(MathjaxFactory().splitMath(props.math), math => math.match(/((\\left)|(\\right))|(\\frac)/)), (math, index) => {
                const svg = MathjaxFactory().toSVG(math);
                console.log(math, svg)
                return (
                    <View key={`MEditable${index}`} style={[StyleSheet.absoluteFill, { alignItems: 'flex-end', flexDirection: 'row-reverse', margin: 5 }]}>
                        <ControlledMathView

                            //math='abc' 
                            //math={math}
                            svg={svg}
                            containerStyle={[styles.flexContainer, { margin: 0 }]}
                            style={{ color: `rgb(${Math.pow(index, 2) % 255}, 255,0)` }}
                            onPress={e => console.log(index)}
                        />
                    </View>
                )
            })}

        </View>
    );
*/
}

const styles = StyleSheet.create({
    flexContainer: {
        display: 'flex',
        flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
        //justifyContent: 'flex-end'
    },
});

const FragmentedMathViewWrapper = React.forwardRef(FragmentedMathView);

FragmentedMathViewWrapper.defaultProps = FragmentedMathView.defaultProps = {
    resizeMode: 'contain',
    hitSlop: defaultHitSlop,
    dev: false
} as Partial<FragmentedMathViewProps>;

export default FragmentedMathViewWrapper;