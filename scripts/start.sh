#!/usr/bin/env bash
cd /home/ubuntu/app

pm2 delete project
pm2 start dist/main.js --name project -- start

echo "$TIME_NOW > Deploy has been completed"