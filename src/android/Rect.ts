
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
    
    protected constructor(left: number, top: number, right: number, bottom: number) {
        if (_.some([left, right, top, bottom], _.isNil)) throw new Error('react-native-math-view: invalid Rect dimension');
        this.left = left;
        this.top = top;
        this.right = right;
        this.bottom = bottom;
    }

    static fromInsets(left: number, top: number, right: number, bottom: number) {
        return new Rect(left, right, top, bottom);
    }

    static fromInsetsRect(rect: Insets) {
        return Rect.fromInsets(rect.left, rect.top, rect.right, rect.bottom);
    }

    static fromLayout(x: number, y: number, width: number, height: number) {
        return new Rect(x, y, x + width, y + height);
    }

    static fromLayoutRect(rect: LayoutRectangle) {
        return Rect.fromLayout(rect.x, rect.y, rect.width, rect.height);
    }

    static fromRect(rect: LayoutRectangle | Insets) {
        return _.has(rect, 'width') && _.has(rect, 'height') ? Rect.fromLayoutRect(rect as LayoutRectangle) : Rect.fromInsetsRect(rect as Insets);
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
        return Rect.fromInsetsRect(this);
    }

    test(x: number, y: number) {
        const h = (x >= this.left) && (x <= this.right);
        const v = y >= this.top && y <= this.bottom;
        return h && v;
    }
    
}