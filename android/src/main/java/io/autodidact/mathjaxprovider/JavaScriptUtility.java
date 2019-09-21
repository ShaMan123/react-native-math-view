package io.autodidact.mathjaxprovider;

import android.webkit.JavascriptInterface;
import android.webkit.WebView;

public class JavaScriptUtility {
    private WebView mWebView;
    public JavaScriptUtility(WebView webView){
        mWebView = webView;
    }

    public void loadScript(final String script){
        mWebView.evaluateJavascript(script, null);
        //mWebView.loadUrl("javascript:(function(){" + script + "})();");
    }

    private String getSizeJSFormula(){
        return "window.WebViewJS.getSize(document.querySelector('body').firstElementChild.getBoundingClientRect().width, document.querySelector('body').offsetHeight);";
    }

    private String setFontColorJSFormula(String fontColor){
        return "document.querySelector('body').style.color = \"" + fontColor + "\";";
    }

    private String resizeObserverScript(){
        return "window.resizeObserver = new ResizeObserver(entries => {\n" +
                getSizeJSFormula() +
                "});\n" +
                "resizeObserver.observe(document.querySelector(\"body\"));\n" +
                "resizeObserver.observe(document.querySelector(\"body\").firstElementChild);";
    }

    private String setStyleString(String key, String value, String elementProvider){
        return elementProvider + ".style." + key + " = \"" + value + "\";";
    }

    public void measureWebView(){
        loadScript(getSizeJSFormula());
    }

    public void runSetFontColorJS(String fontColor){
        loadScript(setFontColorJSFormula(fontColor));
    }

    public void addResizeObserver(){
        loadScript(getSizeJSFormula());
    }

    public static class WebViewBridge {
        MathJaxProvider mContext;
        public WebViewBridge(MathJaxProvider view){
            mContext = view;
        }

        @JavascriptInterface
        public void postMessage(final String message) {
            mContext.post(new Runnable() {
                @Override
                public void run() {
                    mContext.onMessage(message);
                }
            });
        }
    }


}
