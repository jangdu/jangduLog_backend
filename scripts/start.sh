#!/usr/bin/env bash

cd /home/ubuntu/app

pm2 delete project
pm2 start /home/ubuntu/app/dist/main.js --name project

echo " > Deploy has been completed"