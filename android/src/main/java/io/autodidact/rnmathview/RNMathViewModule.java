package io.autodidact.rnmathview;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.uimanager.NativeViewHierarchyManager;
import com.facebook.react.uimanager.UIBlock;
import com.facebook.react.uimanager.UIManagerModule;

public class RNMathViewModule extends ReactContextBaseJavaModule {
    public static final String TAG = "RNMathViewModule";
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
    public void getMathJax(final int tag, final ReadableArray strings, final ReadableMap options, final Promise promise){
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


