import { MathToSVGConfig } from './src/Config';
import MathViewAndroid, { MathViewProps as MathViewPropsAndroid } from './src/MathView.android';
import { MathViewProps as MathViewPropsIOS } from './src/MathView.ios';


declare module 'react-native-math-view' {
    export type MathViewProps = MathViewPropsAndroid | MathViewPropsIOS;
    export default function MathView(props: MathViewProps): ReturnType<typeof MathViewAndroid>;
    
    export module MathProvider {
        export function mathToSVG(math: string, config?: Partial<MathToSVGConfig>): string
    }
}
