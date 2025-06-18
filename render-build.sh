#!/usr/bin/env bash
set -o errexit

# Устанавливаем зависимости
npm install

# Устанавливаем Chromium для Puppeteer
npx puppeteer browsers install chrome
