
let message = {
    data: [
    '\\cos \\left(2\\alpha \\right)=\\cos ^2\\left(\\alpha \\right)-\\sin ^2\\left(\\alpha \\right)',
    '\\left(x^n\\right)\'=n\\cdot x^{n - 1}'
    ],
    options: {html:true}
}

window.ReactNativeWebView = {
    postMessage: (data) => {
        console.log('ReactNativeWebView stub received message', JSON.parse(data))
    }
}

window.postMessage(message);