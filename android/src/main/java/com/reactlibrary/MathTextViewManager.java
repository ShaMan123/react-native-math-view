package com.reactlibrary;

import android.app.Activity;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.pm.ActivityInfo;
import android.content.res.Configuration;
import android.util.Log;

import com.facebook.common.logging.FLog;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.common.ReactConstants;
import com.facebook.react.common.MapBuilder;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.facebook.react.uimanager.annotations.ReactPropGroup;

import java.util.HashMap;
import java.util.Map;
import java.util.ArrayList;
import android.graphics.PointF;

import org.json.JSONStringer;

import javax.annotation.Nullable;

import io.github.kexanie.library.MathView;

public class MathTextViewManager extends SimpleViewManager<MathTextView> {

    public static MathTextView View = null;

    private static final String PROPS_MATH_TEXT = "text";
    private static final String PROPS_MATH_ENGINE = "mathEngine";
    private static final String PROPS_NATIVE_PROPS = "nativeProps";
    private static final String PROPS_VERTICAL_SCROLL = "verticalScroll";
    private static final String PROPS_HORIZONTAL_SCROLL = "horizontalScroll";
    private static final String PROPS_SHOW_SCROLLBAR_DELAY = "showScrollBarDelay";
    private static final String PROPS_MATH_ENGINE_KATEX = "KATEX";
    private static final String PROPS_MATH_ENGINE_MATHJAX = "MATHJAX";

    @Override
    public String getName() {
        return "RNMathTextView";
    }

    @Override
    protected MathTextView createViewInstance(ThemedReactContext context) {
        MathTextViewManager.View = new MathTextView(context);
        //MathTextViewManager.View.setEngine(0);
        //MathTextViewManager.View.setText(" This come from string.You can insert inline formula:  \\(ax^2 + bx + c = 0\\)  or displayed formula: $$\\sum_{i = 0}^n i^2 = \\frac{(n ^ 2 + n)(2n + 1)}{6}$$");
        return MathTextViewManager.View;
    }

    @ReactProp(name = PROPS_MATH_ENGINE)
    public void setMathEngine(MathTextView viewContainer, String engine) {
        int mEngine;
        switch (engine){
            case PROPS_MATH_ENGINE_KATEX:
            default:
                mEngine = MathView.Engine.KATEX;
                break;
            case PROPS_MATH_ENGINE_MATHJAX:
                mEngine = MathView.Engine.MATHJAX;
                break;
        }

        viewContainer.setEngine(mEngine);
    }

    @ReactProp(name = PROPS_MATH_TEXT)
    public void setMathText(MathTextView viewContainer, String text) {
        //String r = text.getString(0).replaceAll("###", "\\\\");
        viewContainer.setText(text);
    }

    @ReactProp(name = PROPS_HORIZONTAL_SCROLL)
    public void setPropsHorizontalScroll(MathTextView viewContainer, boolean scroll) {
        viewContainer.setHorizontalScrollBarEnabled(scroll);
    }

    @ReactProp(name = PROPS_VERTICAL_SCROLL)
    public void setPropsVerticalScroll(MathTextView viewContainer, boolean scroll) {
        viewContainer.setVerticalScrollBarEnabled(scroll);
    }

	public Map getExportedCustomBubblingEventTypeConstants() {
        return MapBuilder.builder()
            .put(
                "topChange",
                MapBuilder.of(
                    "phasedRegistrationNames",
                    MapBuilder.of("bubbled", "onChange")))
                    .build();
    }
}
