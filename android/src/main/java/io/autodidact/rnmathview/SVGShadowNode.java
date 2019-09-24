package io.autodidact.rnmathview;

import android.util.Log;
import android.view.View;
import android.view.ViewGroup;

import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.uimanager.LayoutShadowNode;
import com.facebook.react.uimanager.NativeViewHierarchyManager;
import com.facebook.react.uimanager.UIBlock;
import com.facebook.react.uimanager.UIManagerModule;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.facebook.yoga.YogaMeasureFunction;
import com.facebook.yoga.YogaMeasureMode;
import com.facebook.yoga.YogaMeasureOutput;
import com.facebook.yoga.YogaNode;

import javax.annotation.Nullable;

import static io.autodidact.mathjaxprovider.MathJaxProvider.TAG;

public class SVGShadowNode extends LayoutShadowNode implements YogaMeasureFunction {
    private String svg;
    private SVGAttributes svgAttributes;

    SVGShadowNode() {
        svgAttributes = new SVGAttributes();
        initMeasureFunction();
    }

    private void initMeasureFunction() {
        setMeasureFunction(this);
    }

    private void invalidate(){
        final UIManagerModule uiManager = getThemedContext().getNativeModule(UIManagerModule.class);
        final int tag = getReactTag();
        uiManager.invalidateNodeLayout(tag);
    }

    @ReactProp(name = RNMathViewManager.PROPS_SVG_STRING)
    public void setSVG(String svg) {
        this.svg = svg;
        svgAttributes.setSVG(svg);
        invalidate();
    }

    @ReactProp(name = RNMathViewManager.PROPS_CONFIG)
    public void setConfig(@Nullable ReadableMap config) {
        if(config == null) return;
        if(config.hasKey("ex")){
            svgAttributes.setEX(config.getInt("ex"));
        }
    }

    @Override
    public long measure(
            YogaNode node,
            float width,
            YogaMeasureMode widthMode,
            float height,
            YogaMeasureMode heightMode
    ) {
        final int widthSpec = View.MeasureSpec.makeMeasureSpec(
                ((int) svgAttributes.width),
                View.MeasureSpec.AT_MOST);
        final int heightSpec = View.MeasureSpec.makeMeasureSpec(
                ((int) svgAttributes.height),
                View.MeasureSpec.UNSPECIFIED);

        int measuredWidth = View.resolveSize((int) svgAttributes.width, widthSpec);
        int measuredHeight = View.resolveSize((int) svgAttributes.height, heightSpec);
        return YogaMeasureOutput.make(measuredWidth, measuredHeight);
    }
}