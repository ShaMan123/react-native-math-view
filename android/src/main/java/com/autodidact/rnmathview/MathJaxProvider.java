package com.autodidact.rnmathview;

import android.net.Uri;
import android.support.annotation.NonNull;
import android.support.annotation.Nullable;
import android.util.JsonReader;
import android.util.JsonWriter;
import android.util.Log;
import android.webkit.ValueCallback;
import android.webkit.WebMessage;
import android.webkit.WebView;
import android.webkit.WebViewClient;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.views.view.ReactViewGroup;
import com.facebook.react.views.webview.ReactWebViewManager;

import org.json.JSONException;
import org.json.JSONObject;
import org.json.JSONStringer;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.Iterator;

public class MathJaxProvider extends WebView {
    public static String TAG = "MathJaxProvider";
    private ThemedReactContext mContext;
    private boolean loadingCompleted = false;
    private ArrayList<OnMessageListener> messageListeners = new ArrayList<>();
    private ArrayList<String> pendingScripts = new ArrayList<>();

    public MathJaxProvider(ThemedReactContext context) {
        super(context);
        mContext = context;
        String html = evaluteFile("index.html");
        final String javascript = evaluteFile("dist/bundle.js");

        if(html != null){
            getSettings().setJavaScriptEnabled(true);
            loadDataWithBaseURL("file://", html,"text/html",null, null);

            setWebViewClient(new WebViewClient(){
                @Override
                public void onPageFinished(WebView view, String url) {
                    super.onPageFinished(view, url);
                    evaluateJavascript(javascript, new ValueCallback<String>() {
                        @Override
                        public void onReceiveValue(String s) {
                            postDelayed(new Runnable() {
                                @Override
                                public void run() {
                                    loadingCompleted = true;
                                    for(String script: pendingScripts){
                                        evaluateJavascript(script, null);
                                    }
                                    pendingScripts.clear();
                                }
                            }, 2000);

                        }
                    });
                }
            });


            addJavascriptInterface(new JavaScriptUtility.WebViewBridge(this), "ReactNativeWebView");
        }
    }

    private String evaluteFile(String fileName){
        try{
            InputStream inputStream = mContext.getResources().getAssets().open(fileName);
            BufferedReader r = new BufferedReader(new InputStreamReader(inputStream));
            StringBuilder total = new StringBuilder(inputStream.available());
            for (String line; (line = r.readLine()) != null; ) {
                total.append(line).append('\n');
            }

            return total.toString();
        }
        catch (IOException err){
            Log.e(TAG, "error loading file " + fileName);
            return null;
        }
    }

    public void postRequest(String math){
        postRequest(math, new MathJaxOptions());
    }
    public void postRequest(String math, @NonNull MathJaxOptions options){
        JSONObject o = options.toJSON();
        try{
            o.put("math", math);
        }catch (JSONException err){
            Log.e(TAG, "postRequest: ", err);
            return;
        }

        String script = "window.MathJaxProvider(" + o.toString() + ")";

        if(!loadingCompleted){
            pendingScripts.add(script);
        }
        else{
            evaluateJavascript(script, null);
        }
    }

    protected void onMessage(String message){
        try{
            JSONObject o = new JSONObject(message);
            Log.d(TAG, "isError: " + o.has("error"));
            if(o.has("error")){
                throwError(o.get("error"));
                return;
            }
            String math = o.getString("speakText");
            String svg = o.getString("svg").replaceAll("xlink:xlink", "xlink");
            Double width = o.getDouble("measuredWidth");
            Double height = o.getDouble("measuredHeight");
            Double apprxWidth = o.getDouble("apprxWidth");
            Double apprxHeight = o.getDouble("apprxHeight");

            for(OnMessageListener listener: cloneMessageListeners()){
                listener.invoke(math, svg, width, height, apprxWidth, apprxHeight);
            }
        }
        catch (JSONException err){
            for(OnMessageListener listener: cloneMessageListeners()){
                listener.reject(err);
            }
        }
    }

    private ArrayList<OnMessageListener> cloneMessageListeners(){
        ArrayList<OnMessageListener> copy = new ArrayList<>();
        copy.addAll(messageListeners);
        return copy;
    }

    public void addOnMessageListener(OnMessageListener listener){
        messageListeners.add(listener);
    }

    public void removeOnMessageListener(OnMessageListener listener){
        messageListeners.remove(listener);
    }

    public void removeAllListeners(){
        for(OnMessageListener listener: messageListeners){
            listener.reject();
        }
        messageListeners.clear();
    }

    public void throwError(Object error){
        for(OnMessageListener listener: cloneMessageListeners()){
            Exception e = new Exception(error.toString());
            e.fillInStackTrace();
            listener.reject(error);
        }
    }

    public OnMessageListener getOnMessageListener(int i){
        return messageListeners.get(i);
    }

    public interface OnMessageListener {
        public void invoke(String math, String svg, double width, double height, @Nullable double apprxWidth, @Nullable double apprxHeight);
        public void reject();
        public void reject(Object error);
        public void reject(Throwable error);
    }

    public class MathJaxOptions {
        public boolean excludeTitle = true;
        public boolean parseSize = true;
        protected JSONObject toJSON(){
            JSONObject map = new JSONObject();
            try {
                map.put("excludeTitle", excludeTitle);
                map.put("parseSize", parseSize);
            }
            catch (JSONException err){

            }
            return map;
        }
    }

}
