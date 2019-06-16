package com.autodidact.rnmathview;

import android.app.Activity;
import android.support.v7.app.AppCompatActivity;
import android.util.Log;
import android.view.View;
import android.view.ViewGroup;
import android.view.ViewParent;

import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.views.view.ReactViewGroup;

import javax.annotation.Nonnull;

import static com.autodidact.rnmathview.MathJaxProvider.TAG;

public class MathJaxProviderManager extends SimpleViewManager<MathJaxProvider> {
    public MathJaxProviderManager(){
        super();
    }

    @Override
    public String getName() {
        return "RNMathJaxProvider";
    }

    @Override
    protected MathJaxProvider createViewInstance(ThemedReactContext context) {
        return new MathJaxProvider(context);
    }

    @Override
    public void onDropViewInstance(@Nonnull MathJaxProvider view) {
        super.onDropViewInstance(view);
        view.removeAllListeners();
    }
}
