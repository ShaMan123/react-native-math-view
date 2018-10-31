# react-native-math-view

## WIP

Building a react native math view to easily display and handle math.
Currently depends on `<WebView>` :(

You are welcome to contribute.

## Installation

`npm install --save github:ShaMan123/react-native-math-view`

`yarn add github:ShaMan123/react-native-math-view`

## Implementation:
  - [ ] [iOS native MathView](https://github.com/kostub/iosMath)

  - [x] [Android MathView](https://github.com/kexanie/MathView) based on WebView unfortunately.
    - Bug: does not contain the width of the view => must scroll on long equations.

### Fallback
[react-native-autoheight-webview](https://github.com/iou90/react-native-autoheight-webview) - performance is not good enough.
If you want to use it (for now at least) you need to setup the library. Check sample code in [./src/fallback/MathWebView.js](./src/fallback/MathWebView.js)

### FollowUp

[KaTeX](https://github.com/Khan/KaTeX)

[React with LaTeX](https://github.com/Pomax/BezierInfo-2) - using server side rendering to speed things up.
