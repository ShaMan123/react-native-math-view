package com.autodidact.rnmathview;

import android.util.Log;

import com.facebook.react.common.MapBuilder;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;

import java.util.Map;

public class RNSVGMathViewManager extends SimpleViewManager<SVGMathView> {
    public final String PROPS_SVG_STRING = "svg";
    public final String PROPS_COLOR = "color";
    public final String PROPS_CSS = "css";

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

    @ReactProp(name = PROPS_SVG_STRING)
    public void setSVG(SVGMathView viewContainer, String svg) {
        viewContainer.loadSVG(svg);
    }

    @ReactProp(name = PROPS_COLOR)
    public void setSVG(SVGMathView viewContainer, String color) {
        viewContainer.setColor(color);
    }

    @ReactProp(name = PROPS_CSS)
    public void setSVG(SVGMathView viewContainer, String css) {
        viewContainer.setCSS(css);
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
