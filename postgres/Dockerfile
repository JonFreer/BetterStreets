FROM postgres:13 AS prod

COPY api.sh /docker-entrypoint-initdb.d/

HEALTHCHECK --interval=5s --timeout=5s --retries=12 CMD \
    pg_isready -q -d $API_DB -U $API_DB_USER