#!/usr/bin/env bash

# 이 부분에서 현재 시간을 로그에 추가합니다.
TIME_NOW=$(date +"%Y-%m-%d %H:%M:%S")

# 이 부분에서 로그 파일의 경로를 지정합니다.
LOG_FILE="/path/to/your/logfile.log"

# 로그 파일에 로그 메시지를 추가합니다.
echo "$TIME_NOW > Starting deployment" >> "$LOG_FILE"

cd /home/ubuntu/app

# 로그 파일에 로그 메시지를 추가합니다.
echo "$TIME_NOW > Stopping PM2 process: project" >> "$LOG_FILE"
pm2 delete project

# 로그 파일에 로그 메시지를 추가합니다.
echo "$TIME_NOW > Starting PM2 process: project" >> "$LOG_FILE"
pm2 start /home/ubuntu/app/dist/main.js --name project

# 로그 파일에 로그 메시지를 추가합니다.
echo "$TIME_NOW > Deploy has been completed" >> "$LOG_FILE"
