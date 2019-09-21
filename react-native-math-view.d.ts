import { ViewStyle } from 'react-native';
import MathViewAndroid, { MathViewProps as MathViewPropsAndroid } from './src/android/MathView';
import { CalculatedStyleConfig } from './src/CalculatedStyle';
import { MathToSVGConfig } from './src/Config';
import { MathViewProps as MathViewPropsIOS } from './src/ios/MathView';
import { MathProviderResponse } from './src/MathProvider';


declare module 'react-native-math-view' {
    export type MathViewProps = MathViewPropsAndroid | MathViewPropsIOS;
    export default function MathView(props: MathViewProps): ReturnType<typeof MathViewAndroid>;
    export function useCalculatedStyle(mathOrResponse: string | MathProviderResponse, config: Partial<CalculatedStyleConfig>): ViewStyle;
    
    export module MathProvider {
        export function mathToSvg(math: string, config?: Partial<MathToSVGConfig>): MathProviderResponse
    }
}
