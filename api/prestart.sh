#!/bin/bash
echo "Running pre start"
db-init
# mkdir data
# mkdir data/full
# mkdir data/thumbs
uvicorn betterstreets.main:app --host 0.0.0.0 --port 80 --reload
# uvicorn API.main:app --host 0.0.0.0 --port 80 --reload