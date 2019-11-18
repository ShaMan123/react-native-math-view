export * from './ios/MathView';
export const MathjaxFactory = () => { };

//  fallback to SvgXml
//export { default } from './ios/MathView';
export { default } from './fallback/index';