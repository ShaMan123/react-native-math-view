import { MathToSVGConfig } from './src/mathjax/index';
import MathViewAndroid, { MathViewProps as MathViewPropsAndroid } from './src/index.android';
import MathViewIOS, { MathViewProps as MathViewPropsIOS } from './src/index.ios';
import MathjaxAdaptor from './src/mathjax/MathjaxAdaptor';
import IMathjaxFactory from './src/mathjax/index';

declare module 'react-native-math-view' {
    /**unified android & iOS props */
    export type MathViewProps = MathViewPropsAndroid & MathViewPropsIOS;

    export default function MathView(props: MathViewProps): ReturnType<typeof MathViewAndroid | typeof MathViewIOS>;

    /**
     * **** android only *******
     * This is exported as a convience.
     * There shouldn't be a reason for using this (only PR).
     * 
     * For iOS a stub function is exported because TeX translation is done in native
     * @param config
     */
    export function MathjaxFactory(config?: Partial<MathToSVGConfig>): MathjaxAdaptor;
}
