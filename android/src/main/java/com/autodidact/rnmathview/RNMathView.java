package com.autodidact.rnmathview;

import android.app.Activity;
import android.content.Context;
import android.content.res.Resources;
import android.util.DisplayMetrics;
import android.util.Log;
import android.util.TypedValue;
import android.view.MotionEvent;
import android.view.View;
import android.view.ViewGroup;
import android.webkit.JavascriptInterface;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.RelativeLayout;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;
import com.facebook.react.uimanager.events.RCTEventEmitter;
import com.facebook.react.views.view.*;

import java.lang.reflect.Constructor;
import java.util.ArrayList;
import java.util.Collection;

import io.github.kexanie.library.MathView;

public class RNMathView extends ReactViewGroup {
    public final String TAG = "RNMathView";
    private MathView mathView;
    private ThemedReactContext mContext;
    //private ReactContext reactContext;
    private boolean didSetEngine = false;
    private boolean didSetText = false;
    private String mText = "";
    private boolean pendingText = false;
    private int mEngine;
    private float webViewHeight = -1, webViewWidth = -1;
    float pxWidth, pxHeight;
    private int viewWidth = 0, viewHeight = 0;
    private int mScrollBarDefaultDelayBeforeFade;
    private int mScrollBarFadeDuration;
    private String mFontColor;
    private float mFontScale = 1;
    private boolean isFlexWrap = false;
    private JavaScriptUtility jsUtil;

    public RNMathView(ThemedReactContext context) {
        super(context);
        mContext = context;
        setLayoutParams(new ViewGroup.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT));
        mathView = new MathView(context, null);
        jsUtil = new JavaScriptUtility(mathView);
        addView(mathView);
        mathView.getSettings().setJavaScriptEnabled(true);
        mathView.addJavascriptInterface(this, "WebViewJS");
        mScrollBarDefaultDelayBeforeFade = mathView.getScrollBarDefaultDelayBeforeFade();
        mScrollBarFadeDuration = mathView.getScrollBarFadeDuration();
        //setVisibility(INVISIBLE);

        mathView.setWebViewClient(new WebViewClient() {
            @Override
            public void onPageFinished(WebView webView, String url) {
                jsUtil.runSetFontColorJS(mFontColor);
                jsUtil.addResizeObserver();
                super.onPageFinished(webView, url);
            }
        });
    }

    public MathView getMathView() {
        return mathView;
    }

    public static int getScreenWidth() {
        return Resources.getSystem().getDisplayMetrics().widthPixels;
    }

    private void resizeView(View view, int newWidth, int newHeight) { try { Constructor<? extends LayoutParams> ctor = view.getLayoutParams().getClass().getDeclaredConstructor(int.class, int.class); view.setLayoutParams(ctor.newInstance(newWidth, newHeight)); } catch (Exception e) { e.printStackTrace(); } }

    private void resize(){
        ViewGroup.LayoutParams params = getLayoutParams();
        float scale = getWidth() == 0 ? 1 : (pxWidth) / getWidth();

        if(scale > 1) {
            shrinkFontScale(1 / scale);
            pxWidth /= scale;
            pxHeight /= scale;
        }
        params.width = (int) pxWidth;
        params.height = (int) pxHeight;
        setLayoutParams(params);
        mathView.setLayoutParams(params);

        setMinimumWidth(params.width);
        setMinimumHeight(params.height);
        mathView.setMinimumWidth(params.width);
        mathView.setMinimumHeight(params.height);
        

        //resizeView(this, params.width, params.height);
        //resizeView(mathView, params.width, params.height);

        setVisibility(VISIBLE);
        Log.d(TAG, "resize w: " + params.width);
        Log.d(TAG, "resize h: " + params.height);
        Log.d(TAG, "resize h: " + getWidth());
        invalidate();
/*
        WritableMap event = Arguments.createMap();
        event.putInt("width", (int)(params.width / displayMetrics.density));
        event.putInt("height", (int)(params.height / displayMetrics.density));

        mContext.getJSModule(RCTEventEmitter.class).receiveEvent(
                getId(),
                "topChange",
                event);
                */
    }

    @JavascriptInterface
    public void getSize(String width, String height) {
        // height is in DP units. Convert it to PX if you are adjusting the WebView's height.
        // height could be 0 if WebView visibility is Visibility.GONE.
        // If changing the WebView height, do it on the main thread!

        webViewWidth = Float.parseFloat(width);
        webViewHeight = Float.parseFloat(height);

        if(webViewWidth == 0 || webViewHeight == 0) Log.e(TAG, "Possible LaTeX error");

        new Thread(new Runnable() {
            public void run() {
                post(new Runnable() {
                    public void run() {
                        DisplayMetrics displayMetrics = mContext.getResources().getDisplayMetrics();
                        int padding = 0;
                        pxWidth = TypedValue.applyDimension(TypedValue.COMPLEX_UNIT_DIP, webViewWidth + padding, displayMetrics);
                        pxHeight = TypedValue.applyDimension(TypedValue.COMPLEX_UNIT_DIP, webViewHeight + padding, displayMetrics);
                        resize();
                    }
                });
            }
        }).start();
    }

    @Override
    protected void onSizeChanged(int w, int h, int ow, int oh) {
        super.onSizeChanged(w, h, ow, oh);
        //viewWidth = w;
        //viewHeight = h;
        //resize();
    }

    private void setProps(){
        if(didSetEngine && didSetText){
            mathView.setEngine(mEngine);
            mathView.setText(mText);
        }
    }

    public void setEngine(int engine) {
        mEngine = engine;
        didSetEngine = true;
        setProps();
    }

    public void setText(String text) {
        mText = text;
        didSetText = text != null;
        setProps();
    }

    public void shrinkFontScale(float scale) {
        mFontScale = scale;
        mathView.getSettings().setTextZoom((int)Math.min(scale*100, 100));
    }

    public void setFontColor(String fontColor) {
        mFontColor = fontColor;
        if(mathView.getProgress() == 100){
            jsUtil.runSetFontColorJS(mFontColor);
        }
    }

    public void setScrollBarFadeOptions(int defaultDelayBeforeFade, int fadeDuration){
        setScrollBarFadeDuration(fadeDuration);
        setScrollBarDefaultDelayBeforeFade(defaultDelayBeforeFade);
    }

    public void restoreScrollBarFadeOptionsToDefault(){
        setScrollBarFadeOptions(mScrollBarDefaultDelayBeforeFade, mScrollBarFadeDuration);
    }
}
