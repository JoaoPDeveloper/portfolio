@echo off
set "PATH=C:\Users\joao.lpereira\AppData\Local\nvm\v22.23.1;%PATH%"
set "NODE_TLS_REJECT_UNAUTHORIZED=0"
node -v
npx nuxt dev
