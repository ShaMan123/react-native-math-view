package io.autodidact.rnmathview;

import android.util.Log;
import android.view.View;
import android.view.ViewGroup;

import com.facebook.react.uimanager.LayoutShadowNode;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.facebook.yoga.YogaMeasureFunction;
import com.facebook.yoga.YogaMeasureMode;
import com.facebook.yoga.YogaMeasureOutput;
import com.facebook.yoga.YogaNode;

import static io.autodidact.mathjaxprovider.MathJaxProvider.TAG;

public class SVGShadowNode extends LayoutShadowNode implements YogaMeasureFunction {
    private int mWidth;
    private int mHeight;
    private boolean mMeasured;
    private String svg;
    private SVGAttributes svgAttributes;

    SVGShadowNode() {
        initMeasureFunction();
    }

    private void initMeasureFunction() {
        setMeasureFunction(this);

    }

    @ReactProp(name = RNSVGMathViewManager.PROPS_SVG_STRING)
    public void setSVG(String svg) {
        this.svg = svg;
        svgAttributes = new SVGAttributes(svg);
        Log.d(TAG, "SVGShadowNode setSVG: " + svgAttributes.width);
    }

    @Override
    public long measure(
            YogaNode node,
            float width,
            YogaMeasureMode widthMode,
            float height,
            YogaMeasureMode heightMode
    ) {


        SVGMathView mathView = new SVGMathView(getThemedContext());
        mathView.loadSVG(svg);
        final int widthSpec = View.MeasureSpec.makeMeasureSpec(
                ((int) svgAttributes.width),
                View.MeasureSpec.AT_MOST);
        final int heightSpec = View.MeasureSpec.makeMeasureSpec(
                ((int) svgAttributes.height),
                View.MeasureSpec.UNSPECIFIED);
        //mathView.setMinimumWidth(width);
        mathView.measure(widthSpec, heightSpec);

        mMeasured = true;

        //super.getParent().calculateLayout();
        //calculateLayout();
        Log.d(TAG, "Shadow Node measure: widthSpec " + mathView.getMeasuredWidth() + "  heightSpec  " + mathView.getMeasuredHeight());
        return YogaMeasureOutput.make(mathView.getMeasuredWidth(), mathView.getMeasuredHeight());
    }
}