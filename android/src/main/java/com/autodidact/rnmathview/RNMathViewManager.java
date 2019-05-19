package com.autodidact.rnmathview;

import android.view.View;

import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.common.MapBuilder;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;

import java.util.Map;

import io.github.kexanie.library.MathView;

public class RNMathViewManager extends SimpleViewManager<RNMathView> {

    public static RNMathView View = null;

    private static final String PROPS_MATH_TEXT = "text";
    private static final String PROPS_MATH_ENGINE = "mathEngine";
    private static final String PROPS_NATIVE_PROPS = "nativeProps";
    private static final String PROPS_VERTICAL_SCROLL = "verticalScroll";
    private static final String PROPS_HORIZONTAL_SCROLL = "horizontalScroll";
    private static final String PROPS_SHOW_SCROLLBAR_DELAY = "showScrollBarDelay";
    private static final String PROPS_FONT_COLOR = "fontColor";
    private static final String PROPS_FONT_SHRINK = "fontShrink";
    private static final String PROPS_FLEX_WRAP = "flexWrap";
    private static final String PROPS_SCAELS_TO_FIT = "scalesToFit";

    private static final String PROPS_MATH_ENGINE_KATEX = "KATEX";
    private static final String PROPS_MATH_ENGINE_MATHJAX = "MATHJAX";
    private static final String PROPS_FLEX_WRAP_WRAP = "wrap";

    @Override
    public String getName() {
        return "RNMathView";
    }

    @Override
    protected RNMathView createViewInstance(ThemedReactContext context) {
        RNMathView view = new RNMathView(context);
        //view.setEngine(0);
        //view.setText(" This come from string.You can insert inline formula:  \\(ax^2 + bx + c = 0\\)  or displayed formula: $$\\sum_{i = 0}^n i^2 = \\frac{(n ^ 2 + n)(2n + 1)}{6}$$");
        return view;
    }

    @ReactProp(name = PROPS_MATH_ENGINE)
    public void setMathEngine(RNMathView viewContainer, String engine) {
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
    public void setMathText(RNMathView viewContainer, String text) {
        //String r = text.getString(0).replaceAll("###", "\\\\");
        viewContainer.setText(text);
    }

    @ReactProp(name = PROPS_HORIZONTAL_SCROLL)
    public void setPropsHorizontalScroll(RNMathView viewContainer, boolean scroll) {
        viewContainer.setHorizontalScrollBarEnabled(scroll);
    }

    @ReactProp(name = PROPS_VERTICAL_SCROLL)
    public void setPropsVerticalScroll(RNMathView viewContainer, boolean scroll) {
        viewContainer.setVerticalScrollBarEnabled(scroll);
    }

    @ReactProp(name = PROPS_FONT_COLOR)
    public void setPropsFontColor(RNMathView viewContainer, String color) {
        viewContainer.setFontColor(color);
    }

    @ReactProp(name = PROPS_FONT_SHRINK)
    public void setPropsFontShrink(RNMathView viewContainer, float scale) {
        viewContainer.shrinkFontScale(scale);
    }

    @ReactProp(name = PROPS_SCAELS_TO_FIT)
    public void setPropsScalesToFit(RNMathView viewContainer, boolean fit) {
        viewContainer.setScalesToFit(fit);
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
