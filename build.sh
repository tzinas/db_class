#!/bin/bash

docker-compose build --no-cache
docker-compose up --build --force-recreate
