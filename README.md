# react-native-math-view

| Launch Test | Example App |
| --- | --- |
| ![Launch](./docs/launchAndroid.gif) | ![Example App](./docs/exampleAndroid.gif) |


## WIP V2

Building a react native math view to easily display and handle math.

You are welcome to contribute.

## Installation

`npm install --save react-native-math-view`

`yarn add react-native-math-view`

#### Or for latest:

`npm install --save github:ShaMan123/react-native-math-view`

`yarn add github:ShaMan123/react-native-math-view`

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

