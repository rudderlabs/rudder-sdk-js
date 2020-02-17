#!/usr/bin/env bash

nohup python3 -m http.server 8000 &
npm run buildDevBrowser
cp dist/browser.js tests/html/browser.js
open -a "Google Chrome" http://localhost:8000/tests/html/script-test.html
