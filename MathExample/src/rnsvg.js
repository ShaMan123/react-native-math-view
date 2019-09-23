import * as React from "react";
import { parse } from "svg-parser";
import {
    Circle,
    ClipPath,
    Defs,
    Ellipse,
    G,
    Image,
    Line,
    LinearGradient,
    Mask,
    Path,
    Pattern,
    Polygon,
    Polyline,
    RadialGradient,
    Rect,
    Stop,
    Svg,
    Symbol,
    Text,
    TextPath,
    TSpan,
    Use
} from "react-native-svg";

const tagNameToTag = {
    svg: Svg,
    circle: Circle,
    ellipse: Ellipse,
    g: G,
    text: Text,
    tspan: TSpan,
    textPath: TextPath,
    path: Path,
    polygon: Polygon,
    polyline: Polyline,
    line: Line,
    rect: Rect,
    use: Use,
    image: Image,
    symbol: Symbol,
    defs: Defs,
    linearGradient: LinearGradient,
    radialGradient: RadialGradient,
    stop: Stop,
    clipPath: ClipPath,
    pattern: Pattern,
    mask: Mask
};

const upperCase = (match, letter) => letter.toUpperCase();

const camelCase = phrase => phrase.replace(/-([a-z])/g, upperCase);

function transformStyle(string) {
    const style = {};
    const declarations = string.split(";");
    for (let i = 0, l = declarations.length; i < l; i++) {
        const declaration = declarations[i].split(":");
        const property = declaration[0];
        const value = declaration[1];
        style[camelCase(property.trim())] = value.trim();
    }
    return style;
}

function camelCaseProps(properties) {
    const { style } = properties;
    const props = {};
    for (let property in properties) {
        if (properties.hasOwnProperty(property)) {
            props[camelCase(property)] = properties[property];
        }
    }
    if (style) {
        props.style = transformStyle(style);
    }
    return props;
}

function childToSvg(child, i) {
    const { tagName, properties, children } = child;
    const Tag = tagNameToTag[tagName];
    if (tagName == 'use') console.log(properties)
    return (
        <Tag key={i} {...camelCaseProps(properties)}>
            {children.map(childToSvg)}
        </Tag>
    );
}

function SVGroot({ root, override }) {
    const { properties, children } = root;
    return (
        <Svg {...camelCaseProps(properties)} {...override}>
            {children.map(childToSvg)}
        </Svg>
    );
}

export function SvgFromXml({ xml, ...props }) {
    try {
        const hast = parse(xml.replace(/xlink:href/g, 'href'));
        return <SVGroot root={hast.children[0]} override={props} />;
    } catch (e) {
        console.log(e);
        return null;
    }
}