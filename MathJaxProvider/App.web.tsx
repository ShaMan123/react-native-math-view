import * as React from 'react';
import * as MathJax from './mathjax';

interface MathJaxOptions {
    math: string,
    excludeTitle?: boolean,
    parseSize?: boolean
}

export default class App extends React.Component {
    messageEventDisposer: () => void;
    componentDidMount() {
        if (__DEV__) {
            const devCallback = (message: string) => console.log('__DEV__: ReactNativeWebView received a message', JSON.parse(message));
            const badMath = '\\frac{\\frac{\\frac{\\frac{\\frac{f\'\'\\left(x\\right)=0}{2}}{2}}{2}}{2}}{2}}{2}}{2}}{2}}{2}}{2}}{2}}{2}}{2}}{2}}{2}}{2}}{2}}{2}}{2}}{2}}{2}}{2}}{2}}{2}}{2}}{2}';
            const goodMath ='\\frac{1}{2}'
            if (window.ReactNativeWebView) {
                const originalCallback = window.ReactNativeWebView.postMessage;
                window.ReactNativeWebView.postMessage = {
                    devCallback();
                    originalCallback();
                };
            }
            else {
                window.ReactNativeWebView = {
                    postMessage: devCallback
                }
            }
                
            setTimeout(() => {
                window.postMessage({
                    data: goodMath,
                    origin: 'ReactNativeJS'
                }, '*');
            }, 2000);
        }
        
        MathJax.config({
            MathJax: {
                // traditional MathJax configuration
            },
            displayErrors: true,
            logger: (message: string) => App.postMessage({ error: { message } })
        });
        MathJax.start();

        window.MathJaxProvider = (config: object) => {
            return this.mathjax(config)
                .then(App.postMessage)
                .catch(App.postError);
            ;
        }

        this.messageEventDisposer = this.addMessageListener();
    }
    
    componentWillUnmount() {
        this.messageEventDisposer();
    }

    mathjax(options: MathJaxOptions) {
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
        });
    }

    addMessageListener() {
        const listener = (e) => {
            //document.body.setAttribute("style", "background-color:red");
            let { data, options } = typeof e.data === 'string' ? JSON.parse(e.data) : e.data;
            if (__DEV__) console.log('received message', { data, options });
            //document.body.setAttribute("style", "background-color:green");
            let arr = Array.isArray(data) ? data : [data];
            //document.body.setAttribute("style", "background-color:yellow");
            return Promise.all(arr.map((math) => this.mathjax({ ...options, math })))
                .then(App.postMessage)
                .catch(App.postError);
        };

        window.addEventListener('message', listener);
        return () => window.removeEventListener("message", listener);
    }

    static postError(error: Error | Error[]) {
        //MathJax.start();
        const arr = Array.isArray(error) ? error : [error];
        arr.forEach((error) => {
            App.postMessage({
                error: {
                    name: error.name,
                    message: error.message,
                    stack: error.stack
                }
            });
        });
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