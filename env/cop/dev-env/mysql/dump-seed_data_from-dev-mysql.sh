#!/bin/bash

cd "$(dirname $0)"

INSERT_FILE='seed_data.sql'
echo 'USE swiftx;' >"$INSERT_FILE"
podman run --rm mysql:8.3.0 sh -c 'exec mysqldump -h host.docker.internal --port=5401 -u root --password=my-secret-pw --no-create-info --complete-insert --skip-extended-insert --ignore-table=swiftx.zipcode --ignore-table=swiftx.path_planning_task --ignore-table=swiftx.area_path_planning swiftx' >>"$INSERT_FILE"
