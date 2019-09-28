package io.autodidact.rnmathview;

import androidx.annotation.NonNull;

import java.lang.reflect.Constructor;
import java.lang.reflect.Field;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.HashMap;

public class AccessibleObject {
    private final Object o;

    public AccessibleObject(@NonNull Object o) {
        this.o = o;
        setAccessible();
    }

    public class FieldAccessor {
        private Field mField;

        FieldAccessor(Field field){
            mField = field;
            mField.setAccessible(true);
        }

        FieldAccessor(String fieldName) throws NoSuchFieldException {
            mField = o.getClass().getDeclaredField(fieldName);
            mField.setAccessible(true);
        }

        public String getName(){
            return mField.getName();
        }

        public Object get(){
            try{
                return mField.get(o);
            }
            catch (IllegalAccessException e){
                e.printStackTrace();
            }
            return null;
        }

        public void set(Object value){
            try{
                mField.set(o, value);
            }
            catch (IllegalAccessException e){
                e.printStackTrace();
            }
        }

        public Field getField(){
            return mField;
        }
    }

    public class MethodAccessor {
        private String mMethodName;

        public MethodAccessor(Method method){
            mMethodName = method.getName();
        }

        public MethodAccessor(String methodName){
            mMethodName = methodName;
        }

        public String getName(){
            return mMethodName;
        }

        public Object invoke(Object... params) {
            int paramCount = params.length;
            Method method;
            Object requiredObj = null;
            Class<?>[] classArray = new Class<?>[paramCount];
            for (int i = 0; i < paramCount; i++) {
                classArray[i] = params[i].getClass();
            }
            try {
                method = o.getClass().getDeclaredMethod(mMethodName, classArray);
                method.setAccessible(true);
                requiredObj = method.invoke(o, params);
            } catch (NoSuchMethodException e) {
                e.printStackTrace();
            } catch (IllegalArgumentException e) {
                e.printStackTrace();
            } catch (IllegalAccessException e) {
                e.printStackTrace();
            } catch (InvocationTargetException e) {
                e.printStackTrace();
            }

            return requiredObj;
        }
    }

    public HashMap<String, FieldAccessor> getFields(){
        Field[] fields = o.getClass().getDeclaredFields();
        HashMap<String, FieldAccessor> map = new HashMap<>();
        for (int i = 0; i < fields.length; i++){
            FieldAccessor fieldAccessor = new FieldAccessor(fields[i]);
            map.put(fieldAccessor.getName(), fieldAccessor);
        }
        return map;
    }

    public HashMap<String, MethodAccessor> getMethods(){
        Method[] methods = o.getClass().getDeclaredMethods();
        HashMap<String, MethodAccessor> map = new HashMap<>();
        for (int i = 0; i < methods.length; i++){
            MethodAccessor methodAccessor = new MethodAccessor(methods[i]);
            map.put(methodAccessor.getName(), methodAccessor);
        }
        return map;
    }

    public Object get(String fieldName){
        try{
            return new FieldAccessor(fieldName).get();
        }
        catch (NoSuchFieldException e){
            e.printStackTrace();
            return null;
        }
    }

    public void set(String fieldName, Object value){
        try {
            new FieldAccessor(fieldName).set(value);
        }
        catch (NoSuchFieldException e){
            e.printStackTrace();
        }
    }

    public Object invoke(String methodName, Object... params) {
        return new MethodAccessor(methodName).invoke(params);
    }

    private void setAccessible(){
        Method[] methods = o.getClass().getDeclaredMethods();
        for (int i = 0; i < methods.length; i++){
            methods[i].setAccessible(true);
        }

        Field[] fields = o.getClass().getDeclaredFields();
        for (int i = 0; i < fields.length; i++){
            fields[i].setAccessible(true);
        }
    }

    public static Object createInstance(String longClassName, Object... params){
        try{
            Class<?> c = Class.forName(longClassName);
            Constructor<?> constructor = c.getDeclaredConstructor();
            constructor.setAccessible(true);
            Object o = constructor.newInstance(params);
            return o;
        }
        catch (ClassNotFoundException e){
            e.printStackTrace();
        }
        catch (NoSuchMethodException e){
            e.printStackTrace();
        }
        catch (IllegalAccessException e){
            e.printStackTrace();
        }
        catch (InvocationTargetException e){
            e.printStackTrace();
        }
        catch (InstantiationException e){
            e.printStackTrace();
        }
        return null;
    }
}
