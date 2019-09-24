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
import com.facebook.react.uimanager.NativeViewHierarchyManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.UIBlock;
import com.facebook.react.uimanager.UIManagerModule;

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
        mSVGAttributes = new SVGAttributes();

        setLayerType(View.LAYER_TYPE_HARDWARE, null); //https://bigbadaboom.github.io/androidsvg/use_with_ImageView.html
        setLayoutParams(new ViewGroup.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT));
    }

    public SVGAttributes getSVGAttributes() {
        return mSVGAttributes;
    }

    private void setDocumentDimensions(){
        setDocumentDimensions(mSVGAttributes.width, mSVGAttributes.height);
    }

    private void setDocumentDimensions(float width, float height){

        //mSVG.setDocumentWidth(getsu());
        //mSVG.setDocumentHeight(getHeight());
/*
        mSVG.setDocumentWidth(width);
        mSVG.setDocumentHeight(height);
*/
        //mSVG.setDocumentWidth("100%");
        //mSVG.setDocumentHeight("100%");
    }

    public void loadSVG(String svg){
        try{
            mSVG = SVG.getFromString(svg);
            mSVGAttributes.setSVG(svg);
            mSVG.setRenderDPI(getResources().getDisplayMetrics().xdpi);
            mSVG.setDocumentPreserveAspectRatio(mPreserveAspectRatio);

            //setDocumentDimensions();
            mSVG.setDocumentWidth("100%");
            mSVG.setDocumentHeight("100%");

            setSVG(mSVG);
        }
        catch (SVGParseException err){
            Log.e(TAG, "Failed to parse svg", err);
        }
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
        Log.d(TAG, "setDocumentDimensions: " + (right - left - getPaddingLeft() - getPaddingRight()) + "  " + (bottom - top - getPaddingTop() - getPaddingBottom()));
        setImageAlpha(1);
        setDocumentDimensions(right - left - getPaddingLeft() - getPaddingRight(), bottom - top - getPaddingTop() - getPaddingBottom());
    }

    @Override
    protected void onMeasure(int widthMeasureSpec, int heightMeasureSpec) {
        super.onMeasure(widthMeasureSpec, heightMeasureSpec);
        //setMeasuredDimension(600, 200);
        Log.d(TAG, "onMeasure" + widthMeasureSpec + "  heightSpec  " + heightMeasureSpec);
        int q= getParent() !=null?((ViewGroup) getParent()).getMeasuredWidth():-1;
        Log.d(TAG, "setDocumentDimensions: " + q);
    }
}
