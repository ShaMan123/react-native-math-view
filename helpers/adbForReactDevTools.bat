

@echo off

@echo https://developer.android.com/studio/command-line/adb

cd %USERPROFILE%\AppData\Local\Android\Sdk\platform-tools
adb reverse tcp:8097 tcp:8097
adb devices

timeout /t 3
exit