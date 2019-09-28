
import * as _ from 'lodash';
import { Insets, LayoutRectangle } from 'react-native';

export default class Rect implements LayoutRectangle, Insets {
    left: number
    top: number
    right: number
    bottom: number

    get x() {
        return this.left;
    }

    get y() {
        return this.top;
    }

    get width() {
        return this.right - this.left;
    }

    get height() {
        return this.bottom - this.top;
    }

    get centerX() {
        return this.x + this.width * 0.5;
    }

    get centerY() {
        return this.y + this.height * 0.5;
    }

    set(left: number, top: number, right: number, bottom: number) {
        if (_.some([left, right, top, bottom], _.isNil)) throw new Error('react-native-math-view: invalid Rect dimension');
        this.left = left;
        this.top = top;
        this.right = right;
        this.bottom = bottom;
        return this;
    }

    fromInsetsRect(rect: Insets) {
        return this.set(rect.left, rect.top, rect.right, rect.bottom);
    }

    fromLayout(x: number, y: number, width: number, height: number) {
        return this.set(x, y, x + width, y + height);
    }

    fromLayoutRect(rect: LayoutRectangle) {
        return this.fromLayout(rect.x, rect.y, rect.width, rect.height);
    }

    fromRect(rect: LayoutRectangle | Insets) {
        return _.has(rect, 'width') && _.has(rect, 'height') ? this.fromLayoutRect(rect as LayoutRectangle) : this.fromInsetsRect(rect as Insets);
    }

    inset(left: number, top: number, right: number, bottom: number) {
        this.left += left;
        this.top += top;
        this.right -= right;
        this.bottom -= bottom;
        return this;
    }

    insetRect(rect: Insets) {
        return this.inset(rect.left, rect.top, rect.right, rect.bottom);
    }

    clone() {
        return new Rect().fromInsetsRect(this);
    }

    test(x: number, y: number) {
        const h = (x >= this.left) && (x <= this.right);
        const v = y >= this.top && y <= this.bottom;
        return h && v;
    }
    
}