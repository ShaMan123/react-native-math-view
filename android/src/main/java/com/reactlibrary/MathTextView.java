package com.reactlibrary;

import android.content.Context;
import android.content.res.TypedArray;
import android.graphics.Typeface;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Paint;
import android.graphics.PointF;
import android.graphics.PorterDuff;
import android.graphics.Rect;
import android.os.Environment;
import android.util.Base64;
import android.util.Log;
import android.util.Xml;
import android.view.View;
import android.view.MotionEvent;


import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.events.RCTEventEmitter;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.lang.reflect.Array;
import java.util.ArrayList;

import io.github.kexanie.library.MathView;
import android.util.AttributeSet;
import android.view.ViewGroup;
import android.webkit.JavascriptInterface;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.LinearLayout;

import org.xmlpull.v1.XmlPullParser;

public class MathTextView extends MathView {

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

    public MathTextView(ThemedReactContext context) {
        super(context, null);
        mContext = context;
        setLayoutParams(new ViewGroup.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT));

        getSettings().setJavaScriptEnabled(true);
        addJavascriptInterface(new WebViewResizer(), "WebViewResizer");

        mScrollBarDefaultDelayBeforeFade = getScrollBarDefaultDelayBeforeFade();
        mScrollBarFadeDuration = getScrollBarFadeDuration();
        //setBackgroundColor(Color.TRANSPARENT);

        setWebViewClient(new WebViewClient() {
            @Override
            public void onPageFinished(WebView webView, String url) {
                webView.loadUrl("javascript:window.WebViewResizer.getSize(document.querySelector('body').firstElementChild.getBoundingClientRect().width, document.querySelector('body').offsetHeight);");
                super.onPageFinished(webView, url);
            }
        });
    }

    private class WebViewResizer {
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
    }
/*
    @Override
    protected void onMeasure(int widthMeasureSpec, int heightMeasureSpec) {
        super.onMeasure(widthMeasureSpec, heightMeasureSpec);
    }
*/

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

    /*
    @Override
    protected void onSizeChanged(int w, int h, int ow, int oh) {
        super.onSizeChanged(w, h, ow, oh);
        //int[] m = measure();

        WritableMap event = Arguments.createMap();
        WritableMap size = Arguments.createMap();
        size.putInt("width", w);
        size.putInt("height", ow);
        size.putInt("oldWidth", h);
        size.putInt("oldHeight", oh);
        //size.putInt("w", m[0]);
        //size.putInt("h", m[1]);


        event.putBoolean("onSizeChanged", true);
        event.putMap("size", size);
        event.putInt("progress", getProgress());
        event.putInt("contentHeight", getContentHeight());

        mContext.getJSModule(RCTEventEmitter.class).receiveEvent(
                getId(),
                "topChange",
                event);
    }

    public int[] measure() {
        /*
        //view.setVisibility(View.VISIBLE);

        //LayoutParams parms = (LayoutParams) getLayoutParams();
        final int width = this.getWidth(); //- parms.leftMargin - parms.rightMargin;
        //Rect r = this.getClipBounds();

        measure( MeasureSpec.makeMeasureSpec(width, MeasureSpec.AT_MOST),
                MeasureSpec.makeMeasureSpec(0, MeasureSpec.UNSPECIFIED));

        int targetWidth = getMeasuredWidth();
        int targetHeight = getMeasuredHeight();

        int widthMeasureSpec = View.MeasureSpec.makeMeasureSpec(View.MeasureSpec.UNSPECIFIED, View.MeasureSpec.UNSPECIFIED);
        int heightMeasureSpec = View.MeasureSpec.makeMeasureSpec(0, View.MeasureSpec.UNSPECIFIED);

        //Measure WebView's content
        measure(widthMeasureSpec, heightMeasureSpec);
        layout(0, 0, getMeasuredWidth(), getMeasuredHeight());
        return new int[]{getMeasuredWidth(), getMeasuredHeight()};
    }

    public void receiveSize(){
        WritableMap event = Arguments.createMap();
        WritableMap size = Arguments.createMap();
        size.putInt("w", webViewWidth);
        size.putInt("h", webViewHeight);
        event.putBoolean("onSizeChanged", true);
        event.putMap("size", size);
        event.putInt("progress", getProgress());
        event.putInt("contentHeight", getContentHeight());
        event.putInt("onPageFinished", 500);

        mContext.getJSModule(RCTEventEmitter.class).receiveEvent(
                getId(),
                "topChange",
                event);
    }
/*
    private class JavascriptBridge {
        private WebView webView;

        public JavascriptBridge(WebView webView) {
            this.webView = webView;
        }

        @JavascriptInterface
        public void send(String message) {
            WritableMap event = Arguments.createMap();
            event.putString("message", message);
            ReactContext reactContext = (ReactContext) this.webView.getContext();
            reactContext.getJSModule(RCTEventEmitter.class).receiveEvent(
                    this.webView.getId(),
                    "topChange",
                    event);
        }
    }
    */
}
