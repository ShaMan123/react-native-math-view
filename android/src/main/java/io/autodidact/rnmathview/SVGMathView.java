package io.autodidact.rnmathview;

import android.graphics.Canvas;
import android.graphics.Color;
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
    private String mSVGString;
    private boolean mIsDirty;
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
/*
        mSVG.setDocumentWidth(width);
        mSVG.setDocumentHeight(height);
*/
        //mSVG.setDocumentWidth("100%");
        //mSVG.setDocumentHeight("100%");
    }

    public void setSVGString(String svg) {
        if(mSVGString == null || mSVGString != svg) mIsDirty = true;
        mSVGString = svg;
    }

    public void updateView() {
        if(mIsDirty) loadSVG();
        mIsDirty = false;
    }

    private void loadSVG(String svg) {
        setSVGString(svg);
        loadSVG();
    }

    private void loadSVG(){
        try{
            mSVG = SVG.getFromString(mSVGString);
            mSVGAttributes.setSVG(mSVGString);
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

    public void setColor(int color) {
        int A = (color >> 24) & 0xff; // or color >>> 24
        int R = (color >> 16) & 0xff;
        int G = (color >>  8) & 0xff;
        int B = (color      ) & 0xff;
        //setColor(Color.valueOf(color).toString());
        setColor("rgba(" + R + ", " + G + ", " + B + ", " + A + ")");
    }

    private void setColor(String color){
        mColor = color;
        mColorCSS = "* { fill: " + color + "; stroke: " + color + "; } ";
        postCSS(mColorCSS);
    }

    private void postCSS(final String css){
        super.setCSS(css);
        /*
        post(new Runnable() {
            @Override
            public void run() {
                SVGMathView.super.setCSS(css);
            }
        });
         */
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
}
