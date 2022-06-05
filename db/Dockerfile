FROM postgres

COPY create.sql /docker-entrypoint-initdb.d
COPY data.sql /docker-entrypoint-initdb.d
COPY indexes.sql /docker-entrypoint-initdb.d
