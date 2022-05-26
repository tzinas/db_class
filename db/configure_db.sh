psql postgres -c "DROP DATABASE IF EXISTS db_class"
psql postgres -c "DROP ROLE IF EXISTS db_class"

psql postgres -c "CREATE USER db_class WITH CREATEDB ENCRYPTED PASSWORD 'db_class'"
psql postgres -U db_class -c "CREATE DATABASE db_class OWNER db_class"

psql db_class -U db_class -f create.sql
psql db_class -U db_class -f data.sql
