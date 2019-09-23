package io.autodidact.rnmathview;

import android.graphics.Canvas;
import android.graphics.Picture;
import android.graphics.RectF;
import android.util.Log;
import android.view.View;
import android.view.ViewGroup;

import com.caverock.androidsvg.PreserveAspectRatio;
import com.caverock.androidsvg.RenderOptions;
import com.caverock.androidsvg.*;
import com.caverock.androidsvg.SVG;
import com.caverock.androidsvg.SVGImageView;
import com.caverock.androidsvg.SVGParseException;
import com.facebook.react.uimanager.ThemedReactContext;

import javax.annotation.Nullable;

public class SVGMathView extends SVGImageView {
    private static String TAG = "RNSVGMathView";
    private SVG mSVG;
    private SVGAttributes mSVGAttributes;
    private PreserveAspectRatio mPreserveAspectRatio = PreserveAspectRatio.LETTERBOX;
    private String mCSS = "";
    private String mColor;
    private String mColorCSS = "";

    public SVGMathView(ThemedReactContext context){
        super(context);

        //setLayerType(View.LAYER_TYPE_SOFTWARE, null); //https://bigbadaboom.github.io/androidsvg/use_with_ImageView.html
        setLayoutParams(new ViewGroup.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT));
        //setMinimumWidth(300);
        //setMinimumHeight(100);
    }

    public void loadSVG(String svg){
        try{
            mSVG = SVG.getFromString(svg);
            mSVGAttributes = new SVGAttributes(svg);
            mSVG.setRenderDPI(getResources().getDisplayMetrics().xdpi);
            mSVG.setDocumentPreserveAspectRatio(mPreserveAspectRatio);

            mSVG.setDocumentWidth(mSVGAttributes.width);
            mSVG.setDocumentHeight(mSVGAttributes.height);

            //mSVG.setDocumentWidth("100%");
            //mSVG.setDocumentHeight("100%");

            //mSVG.setDocumentWidth(300);
            //mSVG.setDocumentHeight(100);
            //setMinimumWidth(300);
            //setMinimumHeight(100);
/*
            int width=720;
            int height=100;
            final int widthSpec = View.MeasureSpec.makeMeasureSpec(
                    ((int) width),
                    View.MeasureSpec.AT_MOST);
            final int heightSpec = View.MeasureSpec.makeMeasureSpec(
                    ((int) height),
                    MeasureSpec.UNSPECIFIED);
invalidate();
            measure(widthSpec,heightSpec);

            Log.d(TAG, "loadSVG: "  + getMeasuredWidth() + "  " + getMeasuredHeight());



            requestLayout();
*/


            setSVG(mSVG);
        }
        catch (SVGParseException err){
            Log.e(TAG, "Failed to parse svg", err);
        }
    }

    @Override
    public void requestLayout() {
        Log.d(TAG, "requestLayout: " + isInLayout());
        super.requestLayout();
    }

    public void setColor(String color){
        mColor = color;
        mColorCSS = "* { fill: " + color + "; stroke: " + color + "; } ";
        postCSS(mColorCSS);
    }

    private void postCSS(final String css){
        post(new Runnable() {
            @Override
            public void run() {
                SVGMathView.super.setCSS(css);
            }
        });
    }

    @Override
    public void setCSS(String css) {
        css += mColorCSS;
        postCSS(css);
    }

    public void addCSS(String css) {
        mCSS += css;
        setCSS(css);
    }

    public void clearCSS(){
        mCSS = "";
        setColor(mColor);
    }

    public void setPreserveAspectRatio(String preserveAspectRatio){
        mPreserveAspectRatio = PreserveAspectRatio.of(preserveAspectRatio);
        if(mSVG != null) mSVG.setDocumentPreserveAspectRatio(mPreserveAspectRatio);
    }

    @Override
    protected void onLayout(boolean changed, int left, int top, int right, int bottom) {
        super.onLayout(changed, left, top, right, bottom);
        Log.d(TAG, "onLayout: " +  left + "  " + top+ "  " + right+ "  " +  bottom);
    }

    @Override
    protected void onMeasure(int widthMeasureSpec, int heightMeasureSpec) {
        super.onMeasure(widthMeasureSpec, heightMeasureSpec);
        //setMeasuredDimension(600, 200);
        Log.d(TAG, "onMeasure" + widthMeasureSpec + "  heightSpec  " + heightMeasureSpec);
    }
}
