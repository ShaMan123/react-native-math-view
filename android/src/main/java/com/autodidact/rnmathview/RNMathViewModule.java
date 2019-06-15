package com.autodidact.rnmathview;

import android.app.Activity;
import android.content.Intent;
import android.support.annotation.Nullable;
import android.util.Log;

import com.facebook.common.activitylistener.BaseActivityListener;
import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.Dynamic;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.LifecycleEventListener;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.NativeViewHierarchyManager;
import com.facebook.react.uimanager.PixelUtil;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.UIBlock;
import com.facebook.react.uimanager.UIManagerModule;
import com.facebook.react.views.view.ReactViewGroup;

import org.json.JSONObject;

import java.util.ArrayList;

public class RNMathViewModule extends ReactContextBaseJavaModule {
    private final ReactApplicationContext reactContext;

    public RNMathViewModule(final ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @Override
    public String getName() {
        return "RNMathViewModule";
    }

    @ReactMethod
    public void getMathJax(final int tag, final ReadableArray strings, @Nullable final ReadableMap options, final Promise promise){
        try {
            final ReactApplicationContext context = getReactApplicationContext();
            final UIManagerModule uiManager = context.getNativeModule(UIManagerModule.class);
            uiManager.addUIBlock(new UIBlock() {
                public void execute(NativeViewHierarchyManager nvhm) {
                    MathJaxProvider view = (MathJaxProvider) nvhm.resolveView(tag);
                    new MathJaxRequestHelper(view, strings, options, promise).run();
                }
            });
        } catch (Exception e) {
            promise.reject(e);
        }
    }
}


