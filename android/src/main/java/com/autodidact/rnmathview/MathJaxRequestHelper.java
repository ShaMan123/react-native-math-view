package com.autodidact.rnmathview;

import android.util.Log;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.PromiseImpl;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;

import java.util.ArrayList;

import javax.annotation.Nullable;
import javax.annotation.RegEx;

public class MathJaxRequestHelper implements MathJaxProvider.OnMessageListener {
    private MathJaxProvider mView;
    private WritableArray mathJaxResponse;
    private ArrayList<String> pendingStrings = new ArrayList<>();
    private Promise mPromise;

    public MathJaxRequestHelper(MathJaxProvider view, final ReadableArray strings, final CompletionCallback promise) {
        mPromise = promise;
        init(view, strings);
    }

    public MathJaxRequestHelper(MathJaxProvider view, final ReadableArray strings, final Promise promise) {
        mPromise = promise;
        init(view, strings);
    }

    private void init(MathJaxProvider view, final ReadableArray strings){
        for(int i = 0; i < strings.size(); i++){
            pendingStrings.add(strings.getString(i));
        }
        mView = view;
        mathJaxResponse = Arguments.createArray();
        mView.addOnMessageListener(this);
    }

    public void run(){
        if(pendingStrings.size() == 0) reject("ReadableArray strings is empty");
        for(String s: pendingStrings){
            mView.postRequest(s);
        }
        mView.postDelayed(new Runnable() {
            @Override
            public void run() {
                reject("timeout exceeded");
            }
        }, 5000);
    }

    @Override
    public void invoke(String math, String svg, double width, double height, @Nullable double apprxWidth, @Nullable double apprxHeight) {
        WritableMap map = Arguments.createMap();
        map.putString("math", math);
        map.putString("svg", svg);
        map.putDouble("width", width);
        map.putDouble("height", height);
        map.putDouble("apprxWidth", apprxWidth);
        map.putDouble("apprxHeight", apprxHeight);

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
        reject("View has been destroyed");
    }

    public void reject(String message){
        if(mPromise != null) mPromise.reject("aborted", message);
    }

    public void reject(Throwable err){
        if(mPromise != null) mPromise.reject(err);
    }

    public interface CompletionCallback extends Promise {
        public void resolve(WritableArray response);
        public void reject(String code, String message);
        public void reject(Throwable err);
    }
}
