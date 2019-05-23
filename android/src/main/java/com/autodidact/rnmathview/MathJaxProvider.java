package com.autodidact.rnmathview;

import android.util.Log;
import android.webkit.WebView;

import com.facebook.react.uimanager.ThemedReactContext;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;

public class MathJaxProvider extends WebView {
    public static String TAG = "MathJaxProvider";
    public MathJaxProvider(ThemedReactContext context) {
        super(context);
        try{
            InputStream inputStream = context.getResources().getAssets().open("index.html");
            BufferedReader r = new BufferedReader(new InputStreamReader(inputStream));
            StringBuilder total = new StringBuilder(inputStream.available());
            for (String line; (line = r.readLine()) != null; ) {
                total.append(line).append('\n');
            }

            loadDataWithBaseURL("file://",total.toString(),"text/html",null, null);
        }
        catch (IOException err){
            err.printStackTrace();
            Log.e(TAG, "MathJaxProvider: error loading file");
        }
    }
}
