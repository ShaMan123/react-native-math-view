
import * as _ from 'lodash';
import React, { useCallback, useMemo, useState } from 'react';
import { Button, Switch, Text, View, StyleSheet } from 'react-native';
import MathView, { MathProvider } from 'react-native-math-view';
import Svg, { SvgXml, SvgFromXml, Use, G } from 'react-native-svg';
import AppContext from './Context';
import DifferentLayouts from './DifferentLayouts';
import FlexWrapMathSectionList from './FlexWrapMathSectionList';
import { useInc, useWidth } from './Hooks';
import MathStrings from './math';
import MathSectionList from './MathSectionList';
import Standalone from './Standalone';
import styles from './styles';

import { parse } from 'svg-parser';
import hastToString from 'hast-util-to-string';
import hastToJSX from '@mapbox/hast-util-to-jsx';
import hastToHTML from 'hast-util-to-html';
import MathItem from './MathItem';

const numStates = 4;

const interval = 3000;

const allMath = _.flatten(_.values(MathStrings));

const parsedSVG = parse(MathProvider.mathToSVG(allMath[0]));
const svg = parsedSVG.children[0];
const defs = _.filter(svg.children, (c) => c.tagName === 'defs')[0];
const doc = _.reject(svg.children, (c) => c.tagName === 'defs');

function getDef(id: string, defArr: any[] = defs) {
    if (!id) return;
    const use = _.find(defs.children, (def) => _.isEqual(_.get(def,'properties.id', null), id.substr(1)));
    return use;
}

let mip: { el: any, path: string }[] = [];

function iterateOverChildren(el: { children: any[] }, path?: string|undefined) {
    return _.map(el.children, (child, index) => {
        if (child.tagName === 'defs') return child;

        path = `${path === undefined ? '' : `${path}.`}children.${index}`;
        const xlinkHref = _.get(child.properties, `xlink:href`, null);
        if (xlinkHref) {
            const el = _.cloneDeep(child);
            _.set(el, 'children', [getDef(xlinkHref)])
            _.set(el, 'properties', _.omit(child.properties, 'xlink:href'));
            mip.push({ el: child, path })
            return el;
        }
        else {
            iterateOverChildren(child, path);
            return child;
        }
    })
}

//console.log(_.keys(svg));

//_.map(doc, iterateOverChildren)
iterateOverChildren(svg)
const flatTree = _.map(mip, ({ el, path }) => {
    const tree = _.cloneDeep(svg);
    const defs = _.filter(svg.children, (c) => c.tagName === 'defs');
    //_.set(tree, 'children', defs);
    const p = _.tail(_.split(path, '.'));
    _.reduce(p, (prev, curr, index) => {
        const path = `${prev}.${curr}`;
        if (curr === 'children') {
            //_.set(tree, path, [])
        }
        else {
            //_.set(tree, prev, []);
            //const dest = index === 0 ? `${prev}.${defs.length}` : `${prev}.0`;
            //_.set(tree, `${prev}.0`, _.get(svg, path));
        }
        return path;
    }, path[0])
    
    //_.set(tree, 'children', []);
    /*
    let p = _.split(path, '.');
    let branch = [el];
    console.log(p)
    const tree = _.cloneDeep(svg);
    while (_.size(p) > 1) {
        p = _.dropRight(p);
        _.set(_.get(tree, p),
        _.set(tree, p, [el]);
    }
    */
    console.log(_.reject(tree.children, (c) => c.tagName === 'defs'));
    return hastToHTML(tree);
})

//console.log(_.map(doc,iterateOverChildren));

function getTitle(index: number) {
    switch (index) {
        case -1: return 'Back To Menu';
        case 0: return 'Stanalone View';
        case 1: return 'Flex SectionList';
        case 2: return 'FlexWrap SectionList';
        case 3: return 'Rendering on the Fly';
        default: return '';
    }
}

export default function App() {
    const [page, setPage] = useState(4);

    const [switchValue, setSwitchValue] = useState(false);

    const PageSelector = useCallback(({ index }: { index: number }) => {
        return (
            <Button
                onPress={() => setPage(index)}
                title={getTitle(index)}
            />
        );
    }, []);

    const el = useMemo(() => {
        switch (page) {
            case -1:
                return (
                    <View style={{ flex: 1, justifyContent: 'space-evenly' }}>
                        <PageSelector index={0} />
                        <PageSelector index={1} />
                        <PageSelector index={2} />
                        <PageSelector index={3} />
                        <PageSelector index={4} />
                    </View>
                );
            case 0: return <Standalone />
            case 1: return <MathSectionList />;
            case 2: return <FlexWrapMathSectionList />;
            case 3: return <DifferentLayouts />;
            case 4:
                return (
                    <View style={{ alignItems: 'flex-end', direction: 'ltr' }}>
                        <MathItem math={allMath[0]} />
                        <View style={[StyleSheet.absoluteFill, { alignItems: 'flex-end', flexDirection: 'row-reverse', margin: 5 }]}>
                            {_.map(flatTree, (svg, index) => {
                                console.log('fm',index, svg)
                                return <MathItem key={`MEditable${index}`} math='abc' svg={svg} containerStyle={[styles.flexContainer, { margin: 0 }]} onPress={e => console.log(index)} />
                            })}
                        </View>
                    </View>
                );
                return (
                    <View style={{alignItems: 'flex-end', direction:'ltr'}}>
                        <MathItem math={'\\cos\\left(x\\right)'} />
                        <View style={[StyleSheet.absoluteFill, { alignItems: 'flex-end', flexDirection:'row-reverse' ,margin:5}]}>
                            <MathItem math={'\\cos'} containerStyle={[styles.flexContainer, { margin: 0 }]} onPress={e=>console.log('cos')} />
                            <MathItem math={'\\left(x\\right)'} containerStyle={[styles.flexContainer, { margin: 0 }]} />
                            </View>
                        </View>
                    );
            default: null
        }
    }, [page]);

    return (
        <>
            <View style={styles.default}>
                <AppContext.Provider
                    value={{
                        switch: switchValue,
                        width: useWidth(switchValue),
                        inc: useInc(switchValue)
                    }}
                >
                    {el}
                </AppContext.Provider>
            </View>
            {
                page !== -1 &&
                <View style={{ borderColor: 'darkblue', borderWidth: 2 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                        <Switch
                            onValueChange={setSwitchValue}
                            value={switchValue}
                        />
                        <Text style={{ fontWeight: switchValue ? 'bold' : 'normal' }}>{switchValue ? 'HYPER mode' : 'static mode'}</Text>
                    </View>
                    <PageSelector index={-1} />
                </View>
            }

        </>
    );
}