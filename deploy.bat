@echo off
REM ==============================
REM Build & Backup Deployment Script
REM Version: 1.0
REM Project: React (MUI) + Vite
REM ==============================

REM Enable debugging if DEBUG=1 is set
if "%DEBUG%"=="1" (
    echo [DEBUG] Debug mode enabled
    echo on
)

REM Receive message from parameter, if not set, set default
set "msg=%~1"
if "%msg%"=="" (
    set "msg=Deploy new version"
)

REM Define 3 directories: source, dest, and backup
set "SOURCE=E:\BrowserExtensions\heta"
set "DEST=E:\BrowserExtensions\heta-build"
set "BACKUP=E:\BrowserExtensions\heta-bak"

echo [INFO] Deploy message: %msg%
echo [INFO] Source: %SOURCE%
echo [INFO] Dest: %DEST%
echo [INFO] Backup: %BACKUP%
echo [INFO] Started at: %DATE% %TIME%
echo.

REM Check if source directory exists
echo [CHECK] Verifying source directory...
if not exist "%SOURCE%" (
    echo [ERROR] Source directory does not exist: %SOURCE%
    echo [INFO] Please check the path and try again.
    pause
    exit /b 1
)
echo [OK] Source directory exists

REM Check if destination directory exists, create if not
echo [CHECK] Verifying destination directory...
if not exist "%DEST%" (
    echo [WARNING] Destination directory does not exist: %DEST%
    echo [INFO] Creating destination directory...
    mkdir "%DEST%"
    if %ERRORLEVEL% neq 0 (
        echo [ERROR] Failed to create destination directory
        pause
        exit /b 1
    )
)
echo [OK] Destination directory ready

REM Check if backup directory exists, create if not
echo [CHECK] Verifying backup directory...
if not exist "%BACKUP%" (
    echo [WARNING] Backup directory does not exist: %BACKUP%
    echo [INFO] Creating backup directory...
    mkdir "%BACKUP%"
    if %ERRORLEVEL% neq 0 (
        echo [ERROR] Failed to create backup directory
        pause
        exit /b 1
    )
)
echo [OK] Backup directory ready

REM Build project in source repo
echo [STEP] Building project...
cd /d "%SOURCE%" || (
    echo [ERROR] Failed to change to source directory: %SOURCE%
    pause
    exit /b 1
)

echo [INFO] Running npm run build...
call npm run build
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Build failed with exit code %ERRORLEVEL%
    echo [INFO] Please check the build output above for errors.
    pause
    exit /b 1
)
echo [SUCCESS] Build completed successfully!

REM Check if build output exists
echo [CHECK] Verifying build output...
if not exist "%SOURCE%\dist" (
    echo [ERROR] Build output directory not found: %SOURCE%\dist
    echo [INFO] Build may have failed or output directory is different.
    pause
    exit /b 1
)
echo [OK] Build output directory exists

REM Create backup folder with timestamp
echo [STEP] Creating backup...
cd /d "%BACKUP%" || (
    echo [ERROR] Failed to change to backup directory: %BACKUP%
    pause
    exit /b 1
)

REM Generate timestamp: bak_YYYYMMDD_HHMMSS
for /f "tokens=2 delims==" %%I in ('wmic os get localdatetime /value') do set datetime=%%I
set "TIMESTAMP=%datetime:~0,4%%datetime:~4,2%%datetime:~6,2%_%datetime:~8,2%%datetime:~10,2%%datetime:~12,2%"
set "BAK_FOLDER=bak_%TIMESTAMP%"

echo [INFO] Creating backup folder: %BAK_FOLDER%
mkdir "%BAK_FOLDER%"
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Failed to create backup folder
    pause
    exit /b 1
)
echo [OK] Backup folder created

REM Backup current dest folder to backup
echo [STEP] Backing up current destination files...
if exist "%DEST%\*" (
    xcopy "%DEST%\*" "%BACKUP%\%BAK_FOLDER%\" /E /H /C /I /Y
    if %ERRORLEVEL% neq 0 (
        echo [WARNING] Backup copy had issues (exit code %ERRORLEVEL%)
        echo [INFO] Continuing with deployment...
    ) else (
        echo [SUCCESS] Backup completed successfully
    )
) else (
    echo [INFO] Destination folder is empty, skipping backup
)

REM Copy all files/folders from source/dist to dest
echo [STEP] Copying new build files to destination...
xcopy "%SOURCE%\dist\*" "%DEST%\" /E /H /C /I /Y
if %ERRORLEVEL% neq 0 (
    echo [ERROR] File copy failed with exit code %ERRORLEVEL%
    echo [INFO] Please check if source files exist and destination is writable.
    pause
    exit /b 1
)
echo [SUCCESS] Files copied successfully to destination

echo.
echo [DONE] Deployment finished successfully!
echo [INFO] Build output: %DEST%
echo [INFO] Backup saved: %BACKUP%\%BAK_FOLDER%
echo [INFO] Completed at: %DATE% %TIME%
echo.
pause

