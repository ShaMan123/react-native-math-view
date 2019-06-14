import * as React from 'react';
import * as MathJax from './mathjax';

export default class App extends React.Component {
    messageEventDisposer: () => void;
    componentDidMount() {
        MathJax.config({
            MathJax: {
                // traditional MathJax configuration
            },
            displayErrors: true,
        });
        MathJax.start();
        window.MathJaxProvider = (config: object) => {
            return this.mathjax(config)
                .then(App.postMessage)
                .catch(App.postMessage);
            ;
        }
        this.messageEventDisposer = this.addMessageListener();
    }
    
    componentWillUnmount() {
        this.messageEventDisposer();
    }

    mathjax(options: object) {
        return MathJax.typeset({
            format: "TeX", // or "inline-TeX", "MathML"
            svg: true,
            ...options
        }).then((response) => {
            if (response.svg) {
                let parsedSvgString = response.svg.replace(/\n|\n /g, '') as string;
                parsedSvgString = parsedSvgString.replace(/> </g, '><');

                if (options.excludeTitle) {
                    // remove <title>
                    const startingTag = '<title';
                    const endingTag = 'title>';
                    parsedSvgString = parsedSvgString.substring(0, parsedSvgString.indexOf(startingTag)) + parsedSvgString.substring(parsedSvgString.indexOf(endingTag) + endingTag.length);
                }
                response.svg = parsedSvgString;
            }

            if (options.parseSize) {
                let ex = 6;
                response.apprxWidth = parseFloat(response.width) * ex;
                response.apprxHeight = parseFloat(response.height) * ex;
            }

            return response;
        }).catch((errors) => {
            return { errors };
        });
    }

    addMessageListener() {
        const listener = (e) => {
            //document.body.setAttribute("style", "background-color:red");
            let { data, options } = typeof e.data === 'string' ? JSON.parse(e.data) : e.data;
            //document.body.setAttribute("style", "background-color:green");
            let arr = Array.isArray(data) ? data : [data];
            //document.body.setAttribute("style", "background-color:yellow");
            return Promise.all(arr.map((math) => this.mathjax({ ...options, math })))
                .then(App.postMessage)
                .catch(App.postMessage);
        };

        window.addEventListener('message', listener);
        return () => window.removeEventListener("message", listener);
    }

    static postMessage(data = {}) {
        /**
         * see https://github.com/react-native-community/react-native-webview/blob/master/docs/Reference.md#onmessage
         * */
        //document.body.setAttribute("style", "background-color:blue");
        window.ReactNativeWebView && window.ReactNativeWebView.postMessage(JSON.stringify(data));
    }

    render() {
        return null;
    }
}