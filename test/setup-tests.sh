#!/bin/bash

cd "$(dirname "$0")"

cd advanced-usage
npm ci
cd ..

cd basic-usage
npm ci
cd ..