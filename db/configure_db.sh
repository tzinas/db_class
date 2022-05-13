psql postgres -c "DROP DATABASE IF EXISTS db_class"
psql postgres -c "DROP ROLE IF EXISTS db_class"

psql postgres -c "CREATE USER db_class WITH ENCRYPTED PASSWORD 'db_class'"
psql postgres -c "CREATE DATABASE db_class OWNER db_class"

psql db_class -f create.sql
psql db_class -f data.sql