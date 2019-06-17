// Project: https://github.com/ShaMan123/react-native-math-view
// TypeScript Version: 2.6.2

declare module 'react-native-math-view' {
    import { Context, Component } from 'react';
    import {
        ViewProperties,
        Insets,
        ViewStyle,
        StyleProp,
        View,
        ViewProps,
        ImageResizeMode,
        
    } from 'react-native';

    /*
    import MathJaxHandler, { MathJaxConfig as IMathJaxConfig, MathJaxOptions as IMathJaxOptions, MathJaxResult as IMathJaxResult } from 'mathjax-node';

    export module MathJax {
        export type MathJax = MathJaxHandler
        export type MathJaxConfig = IMathJaxConfig
        export type MathJaxOptions = IMathJaxOptions
        export type MathJaxResult = IMathJaxResult
    }
    */

    export module MathJaxProvider {
        class CacheHandler {
            private getCache(): Promise<MathJaxResponse[]>
            public addToCache(data: Array<MathJaxResponse>): Promise<void>
            /**
             * clear data only from AsyncStorage
             * */
            private clearDatabase(): Promise<void>
            public clearCache(): Promise<void>
            public isCached(key: string): boolean
            public enable(): void
            /**
             * disable the cache manager from updating
             * *** BAD FOR PERFORMANCE ***
             * */
            public disable(): void
            /**
             * disable errors from MathJax
             * */
            public disableWarnings(): void
            /**
             * default is 10000ms
             * @param timeout
             */
            public setMaxTimeout(timeout: number): void
            private handleRequest(math: string | string[]): MathJaxResponse[]
            protected fetch(math: Array<string>, timeout?: number): MathJaxResponse[]
            protected fetch(math: string, timeout?: number): MathJaxResponse
        }
        export const CacheManager: CacheHandler;

        export interface MathJaxResponse {
            math: string,
            svg: string,
            width: number,
            height: number,
            apprxWidth: number,
            apprxHeight: number
        }

        export interface MathJaxProviderProps {
            preload?: string | Array<string>
        }
        export class Provider extends Component<MathJaxProviderProps> {
            /**preload math for later use */
            preload(): void

            /**clear provider cache */
            clear(): void

            getCacheManager(): CacheHandler
        }

        export const Context: Context<CacheHandler>;
    }

    export type ResizeMode = 'center' | 'cover' | 'contain';

    export interface MathViewProps extends ViewProps {
        /**
         * Android: passing `{ svg: string }` means you have to handle styling/layout yourself
         * iOS: pass `{ math: string }`
         * */
        source: { svg: string } | { math: string },

        /**
         * set text color
         * can be set via `setNativeProps`
         * */
        color?: string,

        /**
         * set to `true` to fit the view to it's parent
         * defaults to `false`
         * */
        scaleToFit?: boolean,

        /**
         * defaults to 'center'
         * @default 'cover'
         * */
        resizeMode?: ResizeMode
    }

    export interface StyleLayoutParams {
        maxWidth: number,
        maxHeight?: number,

        /**
         * defaults to 'center' */
        resizeMode?: ResizeMode
    }

    export default class MathView extends Component<MathViewProps> {
        /**
         * Android only
         * @param alignment
         * @param scale
         */
        public static getPreserveAspectRatio(alignment: string, scale: string): string

        /**
         * helper function that provides the style object for custom handling
         * resizeMode defaults to 'center'
         * @param layoutData
         * @param maxWidth
         */
        public static getInnerStyleSync(layoutData: MathJaxProvider.MathJaxResponse, layoutParams: StyleLayoutParams): StyleProp<View>

        /**
         * helper function that provides the style object for custom handling
         * if you need a snyc version consider using `MathView.getInnerStyleSync`
         * @param math
         * @param maxWidth
         */
        public static getInnerStyle(math: string, layoutParams: StyleLayoutParams): Promise<StyleProp<View>>

        /**
         * Android only
         * @param svg
         */
        private update(svg: string): void

        public setNativeProps(props: MathViewProps): void
    }
}
