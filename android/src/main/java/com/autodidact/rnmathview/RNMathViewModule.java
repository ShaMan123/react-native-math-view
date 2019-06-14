package com.autodidact.rnmathview;

import android.app.Activity;
import android.content.Intent;
import android.util.Log;

import com.facebook.common.activitylistener.BaseActivityListener;
import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.LifecycleEventListener;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.NativeViewHierarchyManager;
import com.facebook.react.uimanager.PixelUtil;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.UIBlock;
import com.facebook.react.uimanager.UIManagerModule;

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
    public void getMathJax(final int tag, final ReadableArray strings, final Promise promise){
        try {
            final ReactApplicationContext context = getReactApplicationContext();
            final UIManagerModule uiManager = context.getNativeModule(UIManagerModule.class);
            uiManager.addUIBlock(new UIBlock() {
                public void execute(NativeViewHierarchyManager nvhm) {
                    MathJaxProvider view = (MathJaxProvider) nvhm.resolveView(tag);
                    new RequestHelper(view, strings, promise).run();
                }
            });
        } catch (Exception e) {
            promise.reject(e);
        }
    }

    private class RequestHelper implements MathJaxProvider.OnMessageListener {
        private MathJaxProvider mView;
        private WritableArray mathJaxResponse;
        private ArrayList<String> pendingStrings = new ArrayList<>();
        private Promise mPromise;

        public RequestHelper(MathJaxProvider view, final ReadableArray strings, final Promise promise) {
            for(int i = 0; i < strings.size(); i++){
                pendingStrings.add(strings.getString(i));
            }
            mView = view;
            mPromise = promise;
            mathJaxResponse = Arguments.createArray();
            mView.addOnMessageListener(this);
        }

        public void run(){
            for(String s: pendingStrings){
                mView.postRequest(s);
            }
        }

        @Override
        public void invoke(String math, String svg, double width, double height) {
            WritableMap map = Arguments.createMap();
            map.putString("math", math);
            map.putString("svg", svg);
            map.putDouble("width", width);
            map.putDouble("height", height);

            mathJaxResponse.pushMap(map);
            pendingStrings.remove(math);

            if(pendingStrings.size() == 0) {
                mPromise.resolve(mathJaxResponse);
                mPromise = null;
                destroy();
            }
        }

        private void destroy(){
            mView.removeOnMessageListener(this);
        }

        public void reject(){
            if(mPromise != null) mPromise.reject("aborted","View has been destroyed");
        }
    }
}
