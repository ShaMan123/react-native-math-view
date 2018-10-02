
@echo For more information about this bug:
@echo https://stackoverflow.com/questions/4709137/solution-to-install-failed-insufficient-storage-error-on-android

@echo cd /data/local/tmp
@echo rm *
@cd %USERPROFILE%\AppData\Local\Android\Sdk\platform-tools
adb shell "pm uninstall AutodidactRN"
adb shell "rm -rf /data/app/AutodidactRN-*"
adb shell "rm -rf /data/local/tmp/*"

pause