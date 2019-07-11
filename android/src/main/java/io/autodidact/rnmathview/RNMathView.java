package io.autodidact.rnmathview;

import android.content.res.Resources;
import android.util.DisplayMetrics;
import android.util.Log;
import android.util.TypedValue;
import android.view.ViewGroup;
import android.webkit.JavascriptInterface;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.events.RCTEventEmitter;

import io.github.kexanie.library.MathView;

public class RNMathView extends MathView {
    public final String TAG = "RNMathView";
    //private MathView mathView;
    private ThemedReactContext mContext;
    //private ReactContext reactContext;
    private boolean didSetEngine = false;
    private boolean didSetText = false;
    private String mText = "";
    private boolean pendingText = false;
    private boolean scalesToFit = true;
    private int mEngine;
    private float webViewHeight = -1, webViewWidth = -1;
    float pxWidth, pxHeight;
    private int mScrollBarDefaultDelayBeforeFade;
    private int mScrollBarFadeDuration;
    private String mFontColor;
    private float mFontScale = 1;
    private boolean isFlexWrap = false;
    private JavaScriptUtility jsUtil;

    public RNMathView(ThemedReactContext context) {
        super(context, null);
        mContext = context;
        setLayoutParams(new ViewGroup.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT));
        jsUtil = new JavaScriptUtility(this);
        this.getSettings().setJavaScriptEnabled(true);
        this.getSettings().setCacheMode(WebSettings.LOAD_CACHE_ONLY);
        this.addJavascriptInterface(this, "WebViewJS");
        mScrollBarDefaultDelayBeforeFade = this.getScrollBarDefaultDelayBeforeFade();
        mScrollBarFadeDuration = this.getScrollBarFadeDuration();
        setVisibility(INVISIBLE);

        this.setWebViewClient(new WebViewClient() {
            @Override
            public void onPageFinished(WebView webView, String url) {
                jsUtil.runSetFontColorJS(mFontColor);
                jsUtil.addResizeObserver();
                super.onPageFinished(webView, url);
            }
        });
    }

    public static int getScreenWidth() {
        return Resources.getSystem().getDisplayMetrics().widthPixels;
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
                        ViewGroup.LayoutParams params = getLayoutParams();
                        int maxWidth = getWidth() > 0 ? getWidth(): getScreenWidth();
                        float scale = pxWidth / maxWidth;

                        if(scale >= 1 && scalesToFit) {
                            shrinkFontScale(1 / scale);
                            pxWidth /= scale;
                            pxHeight /= scale;
                        }
                        params.width = (int) pxWidth;
                        params.height = (int) pxHeight;
                        setLayoutParams(params);

                        setVisibility(VISIBLE);

                        WritableMap event = Arguments.createMap();
                        event.putInt("width", (int)(params.width / displayMetrics.density));
                        event.putInt("height", (int)(params.height / displayMetrics.density));

                        mContext.getJSModule(RCTEventEmitter.class).receiveEvent(
                                getId(),
                                "topChange",
                                event);
                    }
                });
            }
        }).start();
    }

    private void setProps(){
        if(didSetEngine && didSetText){
            super.setEngine(mEngine);
            super.setText(mText);
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

    public void shrinkFontScale(float scale) {
        mFontScale = scale;
        this.getSettings().setTextZoom((int)Math.min(scale*100, 100));
    }

    public void setFontColor(String fontColor) {
        mFontColor = fontColor;
        if(this.getProgress() == 100){
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

    public void setScalesToFit(boolean fit){
        scalesToFit = fit;
    }
}
