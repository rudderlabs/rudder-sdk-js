#!/usr/bin/env bash

nohup python3 -m http.server 8000 &
npm run buildDevBrowser
cp dist/browser.js tests/html/
open http://localhost:8000/tests/html/