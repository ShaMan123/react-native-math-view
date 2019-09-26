import { MathToSVGConfig } from './src/Config';
import MathViewAndroid, { MathViewProps as MathViewPropsAndroid } from './src/MathView.android';
import { MathViewProps as MathViewPropsIOS } from './src/MathView.ios';
import { MathjaxAdaptor } from './src/MathjaxFactory';

declare module 'react-native-math-view' {
    export type MathViewProps = MathViewPropsAndroid | MathViewPropsIOS;
    export default function MathView(props: MathViewProps): ReturnType<typeof MathViewAndroid>;
    export function MathjaxFactory(config?: Partial<MathToSVGConfig>): MathjaxAdaptor;
}
