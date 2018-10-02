
@echo off
npm run adb-clear && ^
npm run gradlew-kill && ^
set /p response=Want to clean gradlew? It takes a few minutes to rebuild afterwards (use only if despaired)
IF "%response%"=="yes" (npm run gradlew-clear)


pause