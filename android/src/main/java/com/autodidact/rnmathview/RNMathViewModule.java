package com.autodidact.rnmathview;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;

public class RNMathViewModule extends ReactContextBaseJavaModule {
    private final ReactApplicationContext reactContext;

    public RNMathViewModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @Override
    public String getName() {
        return "RNMathViewModule";
    }
}
