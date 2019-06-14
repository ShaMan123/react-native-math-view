package com.autodidact.rnmathview;

import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;

import javax.annotation.Nonnull;

public class MathJaxProviderManager extends SimpleViewManager<MathJaxProvider> {
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
