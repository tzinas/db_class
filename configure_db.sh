psql postgres -c "DROP ROLE IF EXISTS db_class"

psql postgres -c "CREATE USER db_class WITH ENCRYPTED PASSWORD 'db_class'"
