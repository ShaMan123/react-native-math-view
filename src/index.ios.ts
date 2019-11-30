export * from './ios/MathView';
export const MathjaxFactory = () => { console.warn('iOS shouldn\'t require `MathjaxFactory`') };
export const Constants ={};
//  fallback to SvgXml
export { default } from './ios/MathView';
//export { default } from './fallback/index';
