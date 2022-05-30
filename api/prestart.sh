#!/bin/bash
echo "Running pre start"
db-init
mkdir data
mkdir data/full
mkdir data/thumbs
uvicorn badlyparked.main:app --host 0.0.0.0 --port 80