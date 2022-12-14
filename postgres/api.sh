#!/usr/bin/env bash

set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    CREATE USER $API_DB_USER WITH encrypted password '$API_DB_PASSWORD';
    CREATE DATABASE $API_DB;
    GRANT ALL PRIVILEGES ON DATABASE $API_DB TO $API_DB_USER;
    CREATE TABLE uploads(id INT GENERATED ALWAYS AS IDENTITY, time timestamp, latitude float, longitude float);
EOSQL