package com.autodidact.rnmathview;

import android.graphics.Canvas;
import android.graphics.Picture;
import android.graphics.RectF;
import android.util.Log;
import android.view.View;
import android.view.ViewGroup;

import com.caverock.androidsvg.PreserveAspectRatio;
import com.caverock.androidsvg.RenderOptions;
import com.caverock.androidsvg.SVG;
import com.caverock.androidsvg.SVGImageView;
import com.caverock.androidsvg.SVGParseException;
import com.facebook.react.uimanager.ThemedReactContext;

import javax.annotation.Nullable;

public class SVGMathView extends SVGImageView {
    private static String TAG = "RNSVGMathView";
    private SVG mSVG;
    private PreserveAspectRatio mPreserveAspectRatio = PreserveAspectRatio.LETTERBOX;

    public SVGMathView(ThemedReactContext context){
        super(context);
        //setLayerType(View.LAYER_TYPE_SOFTWARE, null); //https://bigbadaboom.github.io/androidsvg/use_with_ImageView.html
        //setLayoutParams(new ViewGroup.LayoutParams(ViewGroup.LayoutParams.WRAP_CONTENT, ViewGroup.LayoutParams.WRAP_CONTENT));
    }

    public void loadSVG(String svg){
        try{
            mSVG = SVG.getFromString(svg);
            mSVG.setRenderDPI(getResources().getDisplayMetrics().xdpi);
            mSVG.setDocumentPreserveAspectRatio(mPreserveAspectRatio);
            mSVG.setDocumentWidth("100%");
            mSVG.setDocumentHeight("100%");

            setSVG(mSVG);
        }
        catch (SVGParseException err){
            err.printStackTrace();
            Log.e(TAG, "SVGMathView: Failed to parse svg");
        }
    }

    public void setColor(String color){
        String css = "* { fill: " + color + "; stroke: " + color + "; } ";
        setCSS(css);
    }

    public void setPreserveAspectRatio(String preserveAspectRatio){
        mPreserveAspectRatio = PreserveAspectRatio.of(preserveAspectRatio);
        if(mSVG != null) mSVG.setDocumentPreserveAspectRatio(mPreserveAspectRatio);
    }
}
