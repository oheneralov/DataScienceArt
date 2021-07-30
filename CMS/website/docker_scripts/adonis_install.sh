#!/usr/bin/env bash
source /root/.bashrc
mkdir -p tmp
apt-get update
apt-get install sqlite3 -y
npm install sqlite3
npm install
npm i -g @adonisjs/cli
adonis key:generate
adonis migration:refresh
adonis migration:run
adonis seed

adonis serve --dev
