
import * as _ from 'lodash';
import React, { useState, useCallback, useRef, useMemo, MutableRefObject, useEffect } from 'react';
import { LayoutRectangle, StyleSheet, View, LayoutChangeEvent, Insets, TouchableOpacity, TouchableOpacityProps, GestureResponderEvent, I18nManager, Animated } from 'react-native';
import MathjaxFactory, { MathFragmentResponse } from '../mathjax/MathjaxFactory';
import MathView, { ControlledMathView, MathViewProps } from './MathView';

function useLayout() {
    /*
    const [layout, setLayout] = useState<LayoutRectangle>({ x: 0, y: 0, width: 0, height: 0 });
    const onLayout = useCallback((e: LayoutChangeEvent) => setLayout(e.nativeEvent.layout), []);
    */
    const layout = useRef<LayoutRectangle>({ x: 0, y: 0, width: 0, height: 0 });
    const onLayout = useCallback((e: LayoutChangeEvent) => { _.set(layout, 'current', e.nativeEvent.layout) }, []);
    return [layout, onLayout] as [MutableRefObject<LayoutRectangle>, (e: LayoutChangeEvent) => void];
}

function getFragmentRect(layout: LayoutRectangle, viewBox: LayoutRectangle, hitSlop: number | Insets = 0) {
    const left = layout.x + viewBox.x * layout.width;
    const top = layout.y + viewBox.y * layout.height;
    const width = viewBox.width * layout.width;
    const height = viewBox.height * layout.height;
    const right = left + width;
    const bottom = top + height;

    const hitSlopRect = _.isNumber(hitSlop) ? _.mapValues(defaultHitSlop, (value, key) => hitSlop) : hitSlop as Insets;

    const rect = {
        left,
        top,
        right,
        bottom
    }

    const hitRect = _.mapValues(rect, (value, key: keyof Insets) => value + _.get(hitSlopRect, key, 0));
    
    return {
        ...rect,
        width,
        height,
        test(x: number, y: number) {
            const h = (x >= hitRect.left) && (x <= hitRect.right);
            const v = y >= hitRect.top && y <= hitRect.bottom;
            return h && v;
        }
    }
}

function HitTestFactory(layout: MutableRefObject<LayoutRectangle>, data: MathFragmentResponse[], hitSlop: number | Insets) {
    const rectMem = {
        layout, data, hitSlop,
        __rects:[],
        __getRects() {
            this.layout = layout.current;
            this.data = data;
            this.hitSlop = hitSlop;
            this.__rects = _.map(data, ({ viewBox, namespace }, index) => getFragmentRect(layout.current, viewBox, hitSlop));
            return this.__rects;
        },
        
        rects() {
            const useMem = _.isEqual(this.layout, layout.current) && _.isEqual(this.data, data) && _.isEqual(this.hitSlop, hitSlop);
            return useMem ? this.__rects : this.__getRects();
        }
    }

    return function test(x: number, y: number) {
        const response = _.invokeMap(rectMem.rects(), 'test', x, y);
        return _.filter(data, (v, i) => response[i]);
    }
    
}

interface FragmentedMathViewProps extends MathViewProps {
    hitSlop: number | Insets
}

const defaultHitSlop = {
    left: 0,
    top: -20,
    right: 0,
    bottom: 20
};

const getColor = () => Math.round(Math.random() * 255);
const getPixel = () => [getColor(), getColor(), getColor()].join(',');
export const color = () => `rgb(${getPixel()})`;

function FragmentedMathView(props: MathViewProps) {
    const [layoutRef, onLayout] = useLayout();
    const data = MathjaxFactory().toSVGArray(props.math); 
    const test = useRef<ReturnType<typeof HitTestFactory>>(() => { });
    useEffect(() => { _.set(test, 'current', HitTestFactory(layoutRef, data, props.hitSlop)) }, [layoutRef, data, props.hitSlop])

    const onPress = useCallback((e: GestureResponderEvent) => {
        const { pageX: x, pageY: y } = e.nativeEvent;
        _.map(test.current(x, y), ({ namespace, index }) => {
            console.log(index)
            anima[index].setValue(2);
            Animated.spring(anima[index], { toValue: 1, useNativeDriver: true }).start();
            //String.fromCharCode(namespace.charCode)
        });
    }, [layoutRef, data, props.hitSlop]);

    const anima = useMemo(() => _.map(new Array(_.size(data)), ()=>new Animated.Value(1)), []);
    
    return (
        <TouchableOpacity
            style={[styles.flexContainer]}
            onPress={onPress}
        >
            <MathView
                {...props}
                //containerStyle={{ backgroundColor: 'red', opacity: 0 }}
                onLayout={onLayout}
                style={{color:'green', backgroundColor: 'red'}}
            />

            {_.map(data, ({ svg }, index) => {
                console.log(index)
                return (
                    <Animated.View
                        pointerEvents='none'
                        key={`MEditable${index}`}
                        style={[StyleSheet.absoluteFill, styles.flexContainer, { transform: [{ scale: anima[index] }] },/* { alignItems: 'flex-end', flexDirection: 'row-reverse' }*/]}
                    >
                        <ControlledMathView

                            //math='abc' 
                            //math={math}
                            {...props}
                            svg={svg}
                            //containerStyle={[styles.flexContainer, { margin: 0 }]}
                            style={[{ color:color() }]}
                        //onLayout={e=>console.log(e.nativeEvent)}
                        />
                    </Animated.View>
                )
            })}

        </TouchableOpacity>
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
    /*

return (
        <View style={{alignItems: 'flex-end', direction:'ltr'}}>
            <MathItem math={props.math} />
            <View style={[StyleSheet.absoluteFill, { alignItems: 'flex-end', flexDirection:'row-reverse' ,margin:5}]}>
                <MathItem math={'\\cos'} containerStyle={[styles.flexContainer, { margin: 0 }]} onPress={e=>console.log('cos')} />
                <MathItem math={'\\left(x\\right)'} containerStyle={[styles.flexContainer, { margin: 0 }]} />
                </View>
            </View>
        );
   
    return (
        <View style={{ alignItems: 'flex-end', direction: 'ltr' }}>
            <MathItem math={props.math} />
        </View>
    );
     */
}

const styles = StyleSheet.create({
    flexContainer: {
        //flex: 1,
        display: 'flex',
        flexDirection: 'row',
        //flexWrap: 'wrap',
        //justifyContent: 'center',
        //alignItems: 'center',
        //margin: 5

    },
})

FragmentedMathView.defaultProps = {
    //style: styles.flexContainer,
    resizeMode: 'contain',
    hitSlop: defaultHitSlop
}

export default FragmentedMathView;