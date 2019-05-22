package com.autodidact.rnmathview;

import android.support.annotation.NonNull;
import android.util.Log;
import android.widget.ImageView;

import com.caverock.androidsvg.SVG;
import com.caverock.androidsvg.PreserveAspectRatio;
import com.facebook.react.common.MapBuilder;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;

import java.util.Collection;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;

import javax.annotation.Nullable;

public class RNSVGMathViewManager extends SimpleViewManager<SVGMathView> {
    public final String PROPS_SVG_STRING = "svg";
    public final String PROPS_COLOR = "color";
    public final String PROPS_CSS = "css";
    public final String PROPS_PRESERVE_ASPECT_RATIO = "preserveAspectRatio";
    public final String PROPS_SCALE_TYPE = "scaleType";

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
    public void setSVG(SVGMathView viewContainer, String value) {
        viewContainer.loadSVG(value);
    }

    @ReactProp(name = PROPS_COLOR)
    public void setColor(SVGMathView viewContainer, String color) {
        viewContainer.setColor(color);
    }

    @ReactProp(name = PROPS_CSS)
    public void setCSS(SVGMathView viewContainer, String css) {
        viewContainer.setCSS(css);
    }

    @ReactProp(name = PROPS_PRESERVE_ASPECT_RATIO)
    public void setPreserveAspectRatio(SVGMathView viewContainer, String value) {
        viewContainer.setPreserveAspectRatio(value);
    }

    @ReactProp(name = PROPS_SCALE_TYPE)
    public void setScaleType(SVGMathView viewContainer, String value) {
        viewContainer.setScaleType(ImageView.ScaleType.valueOf(value));
    }

    @Nullable
    @Override
    public Map<String, Object> getExportedViewConstants() {
        Map<String, Object> map = new HashMap<>();
        Map<String, Object> scaleType = new HashMap<>();
        Map<String, Object> preserveAspectRatio = new HashMap<>();
        Map<String, Object> scale = new HashMap<>();
        Map<String, Object> alignment = new HashMap<>();
        for (PreserveAspectRatio.Scale c : PreserveAspectRatio.Scale.values()){
            scale.put(c.toString(), c.toString());
        }
        for (PreserveAspectRatio.Alignment c : PreserveAspectRatio.Alignment.values()){
            alignment.put(c.toString(), c.toString());
        }

        preserveAspectRatio.put("Scale", scale);
        preserveAspectRatio.put("Alignment", alignment);
        preserveAspectRatio.put("BOTTOM", PreserveAspectRatio.BOTTOM.toString());
        preserveAspectRatio.put("END", PreserveAspectRatio.END.toString());
        preserveAspectRatio.put("FULLSCREEN", PreserveAspectRatio.FULLSCREEN.toString());
        preserveAspectRatio.put("FULLSCREEN_START", PreserveAspectRatio.FULLSCREEN_START.toString());
        preserveAspectRatio.put("LETTERBOX", PreserveAspectRatio.LETTERBOX.toString());
        preserveAspectRatio.put("START", PreserveAspectRatio.START.toString());
        preserveAspectRatio.put("STRETCH", PreserveAspectRatio.STRETCH.toString());
        preserveAspectRatio.put("TOP", PreserveAspectRatio.TOP.toString());
        preserveAspectRatio.put("UNSCALED", PreserveAspectRatio.UNSCALED.toString());

        for (ImageView.ScaleType c : ImageView.ScaleType.values()){
            scaleType.put(c.toString(), c.toString());
        }

        map.put("PreserveAspectRatio", preserveAspectRatio);
        map.put("ScaleType", scaleType);
        return map;
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
