package com.autodidact.rnmathview;

import android.util.Log;
import android.view.MotionEvent;
import android.view.ViewGroup;
import android.webkit.JavascriptInterface;
import android.webkit.WebView;
import android.webkit.WebViewClient;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.events.RCTEventEmitter;

import java.util.ArrayList;
import java.util.Collection;

import io.github.kexanie.library.MathView;

public class RNMathView extends MathView {
    private ThemedReactContext mContext;
    //private ReactContext reactContext;
    private boolean didSetEngine = false;
    private boolean didSetText = false;
    private String mText = "";
    private boolean pendingText = false;
    private int mEngine;
    private float webViewHeight = -1, webViewWidth = -1;
    private int containerHeight, containerWidth;
    private int mScrollBarDefaultDelayBeforeFade;
    private int mScrollBarFadeDuration;
    private String mFontColor;
    private float mFontScale = 1;
    private boolean isFlexWrap = false;

    public RNMathView(ThemedReactContext context) {
        super(context, null);
        mContext = context;
        setLayoutParams(new ViewGroup.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT));

        getSettings().setJavaScriptEnabled(true);
        addJavascriptInterface(this, "WebViewJS");

        mScrollBarDefaultDelayBeforeFade = getScrollBarDefaultDelayBeforeFade();
        mScrollBarFadeDuration = getScrollBarFadeDuration();
        //setBackgroundColor(Color.TRANSPARENT);

        setWebViewClient(new WebViewClient() {
            @Override
            public void onPageFinished(WebView webView, String url) {
                runSetFontColorJS();
                if(isFlexWrap) loadScript(flexWrapStyle());
                loadScript(resizeObserverScript());
                //loadScript(getSizeJSFormula());
                super.onPageFinished(webView, url);
            }
        });
    }

    @JavascriptInterface
    public void getSize(String width, String height) {
        // height is in DP units. Convert it to PX if you are adjusting the WebView's height.
        // height could be 0 if WebView visibility is Visibility.GONE.
        // If changing the WebView height, do it on the main thread!

        webViewWidth = Float.parseFloat(width);
        webViewHeight = Float.parseFloat(height);

        WritableMap event = Arguments.createMap();
        WritableMap size = Arguments.createMap();
        size.putDouble("width", webViewWidth);
        size.putDouble("height", webViewHeight);
        event.putBoolean("onSizeChanged", true);
        event.putMap("size", size);

        mContext.getJSModule(RCTEventEmitter.class).receiveEvent(
                getId(),
                "topChange",
                event);

    }

    public void loadScript(String script){
        loadUrl("javascript:(function(){" + script + "})();");
    }

    private String getSizeJSFormula(){
        return "window.WebViewJS.getSize(document.querySelector('body').firstElementChild.getBoundingClientRect().width, document.querySelector('body').offsetHeight);";
    }

    private String setFontColorJSFormula(){
        return "document.querySelector('body').style.color = \"" + mFontColor + "\";";
    }

    private String resizeObserverScript(){
        return "window.resizeObserver = new ResizeObserver(entries => {\n" +
                getSizeJSFormula() +
                "});\n" +
                "resizeObserver.observe(document.querySelector(\"body\"));\n" +
                "resizeObserver.observe(document.querySelector(\"body\").firstElementChild);";
    }

    private String flexWrapStyle(){
        String body = "document.querySelector(\"body\")";
        String el = "document.querySelector(\"body\").firstElementChild";
        String script =
                setStyleString("width", containerWidth+"px", body) +
                setStyleString("overflow", "hidden", body) +
                        setStyleString("color", "white", body) +
        setStyleString("flexWrap", "wrap", el) +
        setStyleString("flexDirection", "row", el) +
        setStyleString("alignItems", "center", el);
        return script;
    }

    private String setStyleString(String key, String value, String elementProvider){
        return elementProvider + ".style." + key + " = \"" + value + "\";";
    }

    public void measureWebView(){
        loadScript(getSizeJSFormula());
    }

    public void runSetFontColorJS(){
        loadScript(setFontColorJSFormula());
    }

    @Override
    public void setEngine(int engine) {
        mEngine = engine;
        didSetEngine = true;
        setProps();
    }

    @Override
    public void setText(String text) {
        mText = text;
        didSetText = text != null;
        setProps();
    }

    private void setProps(){
        if(didSetEngine && didSetText){
            super.setEngine(mEngine);
            super.setText(mText);
        }
    }

    public void shrinkFontScale(float scale) {
        mFontScale = scale;
        getSettings().setTextZoom((int)Math.min(scale*100, 100));
    }

    public void setFontColor(String fontColor) {
        mFontColor = fontColor;
        if(getProgress() == 100){
            runSetFontColorJS();
        }
    }

    public void setFlexWrap(boolean flexWrap){
        isFlexWrap = flexWrap;
        if(getProgress() == 100){
            loadScript(flexWrapStyle());
        }
    }

    public void setContainerDimensions(int w, int h){
        containerWidth = w;
        containerHeight = h;
    }

    public void setScrollBarFadeOptions(int defaultDelayBeforeFade, int fadeDuration){
        setScrollBarFadeDuration(fadeDuration);
        setScrollBarDefaultDelayBeforeFade(defaultDelayBeforeFade);
    }

    public void restoreScrollBarFadeOptionsToDefault(){
        setScrollBarFadeOptions(mScrollBarDefaultDelayBeforeFade, mScrollBarFadeDuration);
    }
}
