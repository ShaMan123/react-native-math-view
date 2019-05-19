package com.autodidact.rnmathview;

import android.webkit.WebView;

public class JavaScriptUtility {
    private WebView mWebView;
    public JavaScriptUtility(WebView webView){
        mWebView = webView;
    }

    public void loadScript(String script){
        mWebView.loadUrl("javascript:(function(){" + script + "})();");
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
}
