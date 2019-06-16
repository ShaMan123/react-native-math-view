// Project: https://github.com/ShaMan123/react-native-math-view
// TypeScript Version: 2.6.2

declare module 'react-native-math-view' {
    import * as React from 'react';
    import {
        ViewProperties,
        Insets,
        ViewStyle,
        StyleProp,
        View,
        ViewProps
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
            private getCache(): Promise<void>
            private setCache(): Promise<void>
            public clearCache(): Promise<void>
            public isCached(key: string): boolean
            public setMaxTimeout(timeout: number): void
            protected fetch(math: Array<string>, timeout?: number): Array<MathJaxResponse>
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
        export class Provider extends React.Component<MathJaxProviderProps> {
            /**preload math for later use */
            preload(): void

            /**clear provider cache */
            clear(): void
        }
    }

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
        scaleToFit?: boolean
    }

    export default class MathView extends React.Component<MathViewProps> {
        /**
         * Android only
         * @param alignment
         * @param scale
         */
        public static getPreserveAspectRatio(alignment: string, scale: string): string

        /**
         * Android only
         * @param svg
         */
        private update(svg: string): void

        public setNativeProps(props: MathViewProps): void
    }
}
