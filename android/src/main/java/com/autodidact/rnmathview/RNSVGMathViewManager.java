package com.autodidact.rnmathview;

import android.util.Log;

import com.facebook.react.common.MapBuilder;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;

import java.util.Map;

public class RNSVGMathViewManager extends SimpleViewManager<SVGMathView> {
    public RNSVGMathViewManager(){

    }

    @Override
    public String getName() {
        return "RNSVGMathView";
    }

    @Override
    protected SVGMathView createViewInstance(ThemedReactContext context) {
        SVGMathView view = new SVGMathView(context);
        return view;
    }
/*
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
*/
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
