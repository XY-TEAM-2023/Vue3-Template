@echo off

setlocal

REM 获取当前日期和时间
for /f "tokens=1-4 delims=/ " %%a in ('date /t') do (
  set "month=%%a"
  set "day=%%b"
  set "year=%%c"
)
for /f "tokens=1-3 delims=: " %%a in ('time /t') do (
  set "hour=%%a"
  set "minute=%%b"
  set "second=%%c"
)

REM 设置提交信息为当前时间
set "commit_message=%year%-%month%-%day% %hour%:%minute%:%second%"

REM 添加所有修改的文件
git add -A

REM 提交版本
git commit -m "%commit_message%"

REM 推送到远程仓库
git push

endlocal
