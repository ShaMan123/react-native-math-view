import * as React from 'react';
import * as MathJax from './mathjax';

export default class App extends React.Component {
    messageEventDisposer: () => void;
    async componentDidMount() {
        this.messageEventDisposer = this.addMessageListener();
        MathJax.config({
            MathJax: {
                // traditional MathJax configuration
            },
            displayErrors: false,
        });
        MathJax.start();
        
    }
    
    componentWillUnmount() {
        this.messageEventDisposer();
    }

    async mathjax(options: object) {
        try {
            const response = await MathJax.typeset({
                format: "TeX", // or "inline-TeX", "MathML"
                svg: true,
                ...options
            });

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
                response.width = parseFloat(response.width) * ex;
                response.height = parseFloat(response.height) * ex;
            }

            return response;
        }
        catch (errors) {
            return { errors };
        }
    }

    addMessageListener() {
        const listener = async (e) => {
            let { data, options } = typeof e.data === 'string' ? JSON.parse(e.data) : e.data;
            let arr = Array.isArray(data) ? data : [data];
            const response = await Promise.all(arr.map((math) => this.mathjax({ ...options, math })));
            this.postMessage(response);
        };

        window.addEventListener('message', listener);
        return () => window.removeEventListener("message", listener);
    }

    postMessage(data = {}) {
        /**
         * see https://github.com/react-native-community/react-native-webview/blob/master/docs/Reference.md#onmessage
         * */
        window.ReactNativeWebView && window.ReactNativeWebView.postMessage(JSON.stringify(data));
    }

    render() {
        return <>;
    }
}