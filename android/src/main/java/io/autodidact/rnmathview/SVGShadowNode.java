package io.autodidact.rnmathview;

import android.util.Log;
import android.view.View;
import android.view.ViewGroup;

import com.facebook.react.uimanager.LayoutShadowNode;
import com.facebook.yoga.YogaMeasureFunction;
import com.facebook.yoga.YogaMeasureMode;
import com.facebook.yoga.YogaMeasureOutput;
import com.facebook.yoga.YogaNode;

import static io.autodidact.mathjaxprovider.MathJaxProvider.TAG;

public class SVGShadowNode extends LayoutShadowNode implements YogaMeasureFunction {

    private int mWidth;
    private int mHeight;
    private boolean mMeasured;

    SVGShadowNode() {
        initMeasureFunction();
    }

    private void initMeasureFunction() {
        setMeasureFunction(this);

    }

    @Override
    public long measure(
            YogaNode node,
            float width,
            YogaMeasureMode widthMode,
            float height,
            YogaMeasureMode heightMode) {
        if (!mMeasured) {
            SVGMathView mathView = new SVGMathView(getThemedContext());
            final int spec = View.MeasureSpec.makeMeasureSpec(
                    ViewGroup.LayoutParams.MATCH_PARENT,
                    View.MeasureSpec.UNSPECIFIED);
            mathView.measure(spec, spec);
            mWidth = mathView.getMeasuredWidth();
            mHeight = mathView.getMeasuredHeight();
            mMeasured = true;

            super.getParent().calculateLayout();
            Log.d(TAG, "measure: " + width + "  " + height + "  "+super.getParent().getLayoutWidth());
        }

        return YogaMeasureOutput.make(mWidth, mHeight);
    }
}