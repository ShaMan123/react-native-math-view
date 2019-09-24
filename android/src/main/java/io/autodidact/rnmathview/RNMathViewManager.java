package io.autodidact.rnmathview;

import android.widget.ImageView;

import com.caverock.androidsvg.PreserveAspectRatio;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.common.MapBuilder;
import com.facebook.react.uimanager.LayoutShadowNode;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.UIManagerModule;
import com.facebook.react.uimanager.ViewProps;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.facebook.react.views.text.ReactTextViewManager;

import java.util.HashMap;
import java.util.Map;

import javax.annotation.Nonnull;
import javax.annotation.Nullable;

public class RNMathViewManager extends SimpleViewManager<SVGMathView> {
    public static final String PROPS_SVG_STRING = "svg";
    public static final String PROPS_MATH = "math";
    public static final String PROPS_COLOR = "color";
    public static final String PROPS_CONFIG = "config";
    public static final String PROPS_CSS = "css";
    public static final String PROPS_PRESERVE_ASPECT_RATIO = "preserveAspectRatio";
    public static final String PROPS_SCALE_TYPE = "scaleType";

    private ReactApplicationContext context;

    public RNMathViewManager(){
        super();
    }
    public RNMathViewManager(ReactApplicationContext context){
        super();
        this.context = context;
    }

    @Override
    public String getName() {
        return "RNMathView";
    }

    @Override
    public LayoutShadowNode createShadowNodeInstance() {
        return new SVGShadowNode();
    }

    @Override
    public Class getShadowNodeClass() {
        return SVGShadowNode.class;
    }

    @Override
    protected SVGMathView createViewInstance(ThemedReactContext context) {
        SVGMathView view = new SVGMathView(context);
        return view;
    }

    @Override
    protected void onAfterUpdateTransaction(@Nonnull SVGMathView view) {
        super.onAfterUpdateTransaction(view);
        view.updateView();
    }

    @ReactProp(name = PROPS_SVG_STRING)
    public void setSVG(SVGMathView viewContainer, String value) {
        viewContainer.setSVGString(value);
    }

    @ReactProp(name = PROPS_MATH)
    public void setMath(final SVGMathView viewContainer, String value) {

    }

    @ReactProp(name = ViewProps.COLOR, customType = "Color")
    public void setColor(SVGMathView viewContainer, @Nullable Integer color) {
        if (color != null) {
            viewContainer.setColor(color);
        }
    }

    @ReactProp(name = PROPS_CONFIG)
    public void setConfig(SVGMathView viewContainer, @Nullable ReadableMap config) {
        if(config == null) return;
        if(config.hasKey("ex")){
            viewContainer.getSVGAttributes().setEX(config.getInt("ex"));
        }
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

    @Override
    public void receiveCommand(@Nonnull SVGMathView root, int commandId, @Nullable ReadableArray args) {
        super.receiveCommand(root, commandId, args);
        switch (commandId){
            case 0:
                root.setCSS(args.getString(0));
                break;
            case 1:
                root.addCSS(args.getString(0));
                break;
            case 2:
                root.clearCSS();
                break;
        }

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

    @Nullable
    @Override
    public Map<String, Integer> getCommandsMap() {
        Map<String, Integer> map = new HashMap<>();
        map.put("setCSS", 0);
        map.put("addCSS", 1);
        map.put("clearCSS", 2);
        return  map;
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
