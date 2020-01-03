#!/usr/bin/env bash

npm run buildDevBrowser
cp dist/browser.js tests/html/
open tests/html/index.html