
import * as _ from 'lodash';
import { MathFragmentResponse } from '../../mathjax/MathjaxAdaptor';
import { Insets, LayoutRectangle } from 'react-native';
import Rect from './Rect';

export const defaultHitSlop = {
    left: 5,
    top: 5,
    right: 5,
    bottom: 5
};

export class MathFragmentRect extends Rect {
    hitRect: Rect
    hitSlop: Insets

    setRect(layout: LayoutRectangle, viewBox: LayoutRectangle) {
        const left = viewBox.x * layout.width;
        const top = viewBox.y * layout.height;
        const width = viewBox.width * layout.width;
        const height = viewBox.height * layout.height;
        this.fromLayout(left, top, width, height);
        this.setHitSlop();
        return this;
    }

    setHitSlop(hitSlop: number | Insets = 0) {
        this.hitSlop = _.isNumber(hitSlop) ? _.mapValues(defaultHitSlop, (value, key) => hitSlop) : hitSlop as Insets;
        this.hitRect = this
            .clone()
            .insetRect(_.mapValues(this.hitSlop, value => -value));
        return this;
    }

    //@override
    //@ts-ignore
    clone() {
        return new MathFragmentRect().fromInsetsRect(this);
    }

    //@override
    //@ts-ignore
    test(x: number, y: number) {
        return {
            x: Math.abs(x - this.hitRect.centerX),
            y: Math.abs(y - this.hitRect.centerY),
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
        return this;
    }

    set(layout: LayoutRectangle, data: MathFragmentResponse[]) {
        this.layout = layout;
        this.data = data;
        this.rects = _.map(this.data, ({ viewBox, namespace }, index) => {
            const rect = new MathFragmentRect();
            rect.setRect(this.layout, viewBox);
            rect.setHitSlop(this.hitSlop);
            return rect;
        });
        return this;
    }

    test(x: number, y: number) {
        const hitResults = _.map(this.rects, (rect, index) => _.assign({ hitResult: rect.test(x, y) }, this.data[index], { index }));
        return _.sortBy(_.filter(hitResults, 'hitResult.hit'), ['x', 'asc'], ['y', 'asc']);
    }
}