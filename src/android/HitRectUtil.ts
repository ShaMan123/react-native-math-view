
import * as _ from 'lodash';
import { Insets, LayoutRectangle } from 'react-native';
import { MathFragmentResponse } from '../mathjax/MathjaxFactory';
import Rect from './Rect';

const defaultHitSlop = {
    left: 5,
    top: 5,
    right: 5,
    bottom: 5
};

class MathFragmentRect extends Rect {
    hitRect: Rect
    hitSlop: Insets
    constructor(layout: LayoutRectangle, viewBox: LayoutRectangle, hitSlop: number | Insets = 0) {
        super();
        this.setRect(layout, viewBox);
        this.setHitSlop(hitSlop);
    }

    setRect(layout: LayoutRectangle, viewBox: LayoutRectangle) {
        const left = viewBox.x * layout.width;
        const top = viewBox.y * layout.height;
        const width = viewBox.width * layout.width;
        const height = viewBox.height * layout.height;
        this.fromLayout(left, top, width, height);
    }

    setHitSlop(hitSlop: number | Insets = 0) {
        this.hitSlop = _.isNumber(hitSlop) ? _.mapValues(defaultHitSlop, (value, key) => hitSlop) : hitSlop as Insets;
        this.hitRect = this
            .clone()
            .insetRect(_.mapValues(this.hitSlop, value => -value));
    }

    //@override
    //@ts-ignore
    test(x: number, y: number) {
        return {
            x: Math.abs(x - this.centerX),
            y: Math.abs(y - this.centerY),
            hit: super.test(x, y)
        };
    }

}

export default class HitRectUtil {
    private layout: LayoutRectangle;
    private data: MathFragmentResponse[] = [];
    rects: MathFragmentRect[] = [];
    hitSlop: number | Insets

    setHitSlop(hitSlop: number | Insets = 0) {
        _.forEach(this.rects, rect => rect.setHitSlop(hitSlop));
    }

    set(layout: LayoutRectangle, data: MathFragmentResponse[]) {
        this.layout = layout;
        this.data = data;
        this.rects = _.map(this.data, ({ viewBox, namespace }, index) => new MathFragmentRect(this.layout, viewBox, this.hitSlop));
    }

    test(x: number, y: number) {
        return _.sortBy(_.map(this.rects, (rect) => rect.test(x, y)), ['x', 'asc'], ['y', 'asc']);
    }
}