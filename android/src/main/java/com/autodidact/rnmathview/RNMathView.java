package com.autodidact.rnmathview;

import android.view.MotionEvent;
import android.view.ViewGroup;
import android.webkit.JavascriptInterface;
import android.webkit.WebView;
import android.webkit.WebViewClient;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.events.RCTEventEmitter;

import io.github.kexanie.library.MathView;

public class RNMathView extends MathView {

    public static RNMathView View;
    private ThemedReactContext mContext;
    //private ReactContext reactContext;
    private boolean didSetEngine = false;
    private boolean didSetText = false;
    private String mText = "";
    private boolean pendingText = false;
    private int mEngine;
    private int webViewHeight = -1, webViewWidth = -1;
    private int mScrollBarDefaultDelayBeforeFade;
    private int mScrollBarFadeDuration;
    private String mFontColor;
    private WebViewJS webViewJS = new WebViewJS();

    public RNMathView(ThemedReactContext context) {
        super(context, null);
        mContext = context;
        setLayoutParams(new ViewGroup.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT));

        getSettings().setJavaScriptEnabled(true);
        addJavascriptInterface(webViewJS, "WebViewJS");

        mScrollBarDefaultDelayBeforeFade = getScrollBarDefaultDelayBeforeFade();
        mScrollBarFadeDuration = getScrollBarFadeDuration();
        //setBackgroundColor(Color.TRANSPARENT);

        setWebViewClient(new WebViewClient() {
            @Override
            public void onPageFinished(WebView webView, String url) {
                webViewJS.runGetSizeJS();
                webViewJS.runSetFontColorJS();
                super.onPageFinished(webView, url);
            }
        });
    }

    private class WebViewJS {
        @JavascriptInterface
        public void getSize(String width, String height) {
            // height is in DP units. Convert it to PX if you are adjusting the WebView's height.
            // height could be 0 if WebView visibility is Visibility.GONE.
            // If changing the WebView height, do it on the main thread!

            WritableMap event = Arguments.createMap();
            WritableMap size = Arguments.createMap();
            size.putString("width", width);
            size.putString("height", height);
            event.putBoolean("onSizeChanged", true);
            event.putMap("size", size);

            mContext.getJSModule(RCTEventEmitter.class).receiveEvent(
                    getId(),
                    "topChange",
                    event);

            //Log.d("RNMathTextView", "w: " + width + " h: " + height);
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

        public void runGetSizeJS(){
            webViewJS.loadScript(webViewJS.getSizeJSFormula());
        }

        public void runSetFontColorJS(){
            webViewJS.loadScript(webViewJS.setFontColorJSFormula());
        }
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

    public void setScrollBarFadeOptions(int defaultDelayBeforeFade, int fadeDuration){
        setScrollBarFadeDuration(fadeDuration);
        setScrollBarDefaultDelayBeforeFade(defaultDelayBeforeFade);
    }

    public void restoreScrollBarFadeOptionsToDefault(){
        setScrollBarFadeOptions(mScrollBarDefaultDelayBeforeFade, mScrollBarFadeDuration);
    }

    public void setFontColor(String fontColor) {
        mFontColor = fontColor;
        if(getProgress() == 100){
            webViewJS.runSetFontColorJS();
        }
    }
}
