
@echo off
set /p openDevTools=Want to open react-devtools?

start "adb for connected device emulation" adbForDeviceEmulator.bat

IF "%openDevTools%"=="yes" (start "react-devtools" reactDevtools.bat)

start "react-native log-android" logAndroid.bat
start "react-native run-android" runAndroid.bat



