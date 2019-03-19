# react-native-math-view

## WIP

Building a react native math view to easily display and handle math.
Currently depends on `<WebView>` :(

You are welcome to contribute.

## Installation

`npm install --save react-native-math-view`

`yarn add react-native-math-view`

#### Or for latest:

`npm install --save github:ShaMan123/react-native-math-view`

`yarn add github:ShaMan123/react-native-math-view`

## Implementation:
  - [ ] [iOS native MathView](https://github.com/kostub/iosMath) - linked native! Need to create RN component

  - [x] [Android MathView](https://github.com/kexanie/MathView) based on WebView. Refactored to behave like a proper `<View>`.

### Fallback
[react-native-autoheight-webview](https://github.com/iou90/react-native-autoheight-webview) - performance is not good enough.
If you want to use it (for now at least) you need to setup the library. Check sample code in [./src/fallback/MathWebView.js](./src/fallback/MathWebView.js)

### FollowUp

[KaTeX](https://github.com/Khan/KaTeX) - Math keypad that works with `<WebView>`. See [this](https://github.com/ShaMan123/math-input)

[React with LaTeX](https://github.com/Pomax/BezierInfo-2) - using server side rendering to speed things up.

[Writing math dynamically](https://github.com/nicolewhite/algebra.js)

SVG:
Couldn't get this to work.
- [SVG for RN](https://github.com/vault-development/react-native-svg-uri)
- [SVG to RN component](https://www.smooth-code.com/open-source/svgr/playground/)
- [mathjax-node](https://github.com/mathjax/MathJax-node)

