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

    export module MathJaxProvider {
        class CacheHandler {
            private getCache(): Promise<void>
            private setCache(): Promise<void>
            public clearCache(): Promise<void>
            public isCached(key: string): boolean
        }
        export const cacheHandler: CacheHandler;

        export interface MathJaxResponse {
            math: string,
            svg: string,
            width: number,
            height: number,
            apprxWidth: number,
            apprxHeight: number
        }

        /**
         * 
         * @param math
         */
        export function getMathJax(math: Array<string>): Array<MathJaxResponse>;
        export function getMathJax(math: string): MathJaxResponse;

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
        color?: string,
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
