#!/bin/bash
echo "Running pre start"
db-init
uvicorn badlyparked.main:app --host 0.0.0.0 --port 80