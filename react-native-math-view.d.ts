import MathViewAndroid, { MathViewProps as MathViewPropsAndroid } from './src/android/MathView';
import MathViewIOS, { MathViewProps as MathViewPropsIOS } from './src/ios/MathView';
declare module 'react-native-math-view' {
    export type MathViewProps = MathViewPropsAndroid | MathViewPropsIOS;
    export default function MathView(props: MathViewProps): ReturnType<typeof MathViewAndroid>
}
