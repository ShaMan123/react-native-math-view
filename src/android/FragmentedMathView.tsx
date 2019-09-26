
import * as _ from 'lodash';
import React, { useState, useCallback, useRef, useMemo } from 'react';
import { LayoutRectangle, StyleSheet, View, LayoutChangeEvent, Insets, TouchableOpacity } from 'react-native';
import MathjaxFactory, { MathFragmentResponse } from '../mathjax/MathjaxFactory';
import MathView, { ControlledMathView, MathViewProps } from './MathView';

function useLayout() {
    /*
    const [layout, setLayout] = useState<LayoutRectangle>({ x: 0, y: 0, width: 0, height: 0 });
    const onLayout = useCallback((e: LayoutChangeEvent) => setLayout(e.nativeEvent.layout), []);
    */
    const layout = useRef<LayoutRectangle>({ x: 0, y: 0, width: 0, height: 0 });
    const onLayout = useCallback((e: LayoutChangeEvent) => { _.set(layout, 'current', e.nativeEvent.layout) }, []);
    return [layout.current, onLayout] as [LayoutRectangle, (e: LayoutChangeEvent) => void];
}

function getFragmentRect(layout: LayoutRectangle, viewBox: LayoutRectangle, hitSlop: number | Insets) {
    const left = layout.x + viewBox.x * layout.width;
    const top = layout.y + viewBox.y * layout.height;
    const width = viewBox.width * layout.width;
    const height = viewBox.height * layout.height;
    const right = left + width;
    const bottom = top + height;

    const hitSlopRect = _.isNumber(hitSlop) ? _.mapValues(defaultHitSlop, (value, key) => hitSlop) : hitSlop; //as Insets;

    const rect = {
        left,
        top,
        right,
        bottom
    }

    const hitRect = _.mapValues(rect, (value, key: keyof Insets) => value + hitSlopRect[key]);

    return {
        ...rect,
        width,
        height,
        test(x: number, y: number) {
            const h = x >= hitRect.left && x <= hitRect.right;
            const v = y >= hitRect.top && y <= hitRect.bottom;
            return h && v;
        }
    }
}

function HitTestFactory(layout: LayoutRectangle, data: MathFragmentResponse[], hitSlop: number | Insets) {
    const rects = _.map(data, ({ viewBox, namespace }, index) => getFragmentRect(layout, viewBox, hitSlop));
    return (x: number, y: number) => {
        const response = _.invokeMap(rects, 'test', x, y);
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

function FragmentedMathView(props: MathViewProps) {
    const [layout, onLayout] = useLayout();
    const data = MathjaxFactory().toSVGArray(props.math); 
    const test = useMemo(() => HitTestFactory(layout, data, props.hitSlop), [layout, data, props.hitSlop])
    const onPress = useCallback((e) => {
        const { locationX: x, locationY: y } = e.nativeEvent;
        console.log('pressing.....', test(x, y))
        _.map(test(x, y), ({ namespace }) => console.log(namespace.charCode));
    }, [layout, data, props.hitSlop])
    
    return (
        <TouchableOpacity
            style={[styles.flexContainer, { alignItems: 'flex-end', direction: 'ltr' }]}
            onPress={onPress}
        >
            <MathView
                {...props}
                //containerStyle={{ backgroundColor: 'red', opacity: 0 }}
                onLayout={onLayout}
                style={{color:'green', backgroundColor: 'red'}}
            />

            {_.map(data, ({ svg }, index) => {
                return null;
                return (
                    <View
                        pointerEvents='none'
                        key={`MEditable${index}`}
                        style={[StyleSheet.absoluteFill, [styles.flexContainer],/* { alignItems: 'flex-end', flexDirection: 'row-reverse' }*/]}
                    >
                        <ControlledMathView

                            //math='abc' 
                            //math={math}
                            {...props}
                            svg={svg}
                            //containerStyle={[styles.flexContainer, { margin: 0 }]}
                            style={[{ color:'blue' }]}
                        //onLayout={e=>console.log(e.nativeEvent)}
                        />
                    </View>
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