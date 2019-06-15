# react-native-math-view

| Launch Test | Example App |
| --- | --- |
| ![Launch](./docs/launchAndroid.gif) | ![Example App](./docs/exampleAndroid.gif) |


## WIP V2

A react native view used to easily display and handle math.

## Installation

`npm install --save react-native-math-view`

`yarn add react-native-math-view`

#### Or for latest:

`npm install --save github:ShaMan123/react-native-math-view`

`yarn add github:ShaMan123/react-native-math-view`

## Getting Started
```js
import MathView, { MathJaxProvider } from 'react-native-math-view';

render() {
  return (
    ...
    
    // Android only:
    // Android MathView depends on MathJaxProvider.Provider
    // Render this element once at the top of your app as soon as possible
    // Use `preload` to enhance performance. To make this work install '@react-native-community/async-storage'
    <MathJaxProvider.Provider
        preload={['\\cos\\left(x\\right)=\\frac{b}{c}']}
    />
    
    <MathView
        source={{ math: 'x=\\frac{-b\\pm\\sqrt{b^2-4ac}}{2a}' }}
    /> 
    <MathView
        source={{ math: '\\cos\\left(x\\right)=\\frac{b}{c}' }}
    /> 
    
    ...
  );
}

```

## Running example app
from the project's directory run:
```
cd RNMathExample
yarn --production=false
yarn react-native start
```

## Implementation:
  - [ ] [iOS native MathView](https://github.com/kostub/iosMath) - linked native! Need to create RN component

  - [x] Android MathView - **native since V2**, based on [Android SVGImageView](https://bigbadaboom.github.io/androidsvg). Need to implement `editable` state.

### FollowUp

[KaTeX](https://github.com/Khan/KaTeX) - Math keypad that works with `<WebView>`. See [this](https://github.com/ShaMan123/math-input)

[React with LaTeX](https://github.com/Pomax/BezierInfo-2) - using server side rendering to speed things up.

[Writing math dynamically](https://github.com/nicolewhite/algebra.js)

