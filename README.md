# Run backend application

## Installation

1. Install [Java 8 SDK](https://www.oracle.com/java/technologies/downloads/#java8) Java 1.8 is necessary, other version are not fully compatible with kotlin
2. Install Kotlin 1.3.72 (preferable) or 1.4.30
3. Install Docker (to run DB)
4. Install Gradle (to run BE Kotlin services)

## No hybrid model - without docker

Used `jehlomat` as postgres database name and `jehlomat` as username to database. 
Please change it in example by your postgres configuration. 

1) Install postgres DB
2) Install postgis extensions (https://postgis.net/install/)
3) Add testing data

```shell
  psql -h localhost -p 5432 -U jehlomat -d jehlomat -f ./service-jehlomat/src/main/resources/sql/postgis.sql
  psql -h localhost -p 5432 -U jehlomat -d jehlomat -f ./service-jehlomat/src/test/resources/obce.sql
  psql -h localhost -p 5432 -U jehlomat -d jehlomat -f ./service-jehlomat/src/test/resources/mc.sql
  psql -h localhost -p 5432 -U jehlomat -d jehlomat -f ./service-jehlomat/src/test/resources/okres.sql
  psql -h localhost -p 5432 -U jehlomat -d jehlomat -f ./service-jehlomat/src/main/resources/sql/create_table.sql
```

4) Create the Magdalena organization and super admin with email `jehlomat@cesko.digital` and password `SuperAdmin1`. Use this script only for testing purposes.
```shell
  psql -h localhost -p 5432 -U jehlomat -d jehlomat -f ../service-jehlomat/src/main/resources/sql/insert_super_admin.sql
```
5) Set environment variables
```shell
export DATABASE_HOST=localhost
export DATABASE_PORT=5432
export DATABASE_USERNAME=jehlomat
export PGPASSWORD=<YOUR POSTGRES PASSWORD>
export DATABASE_NAME=jehlomat
export JWT_ISSUER=http://localhost:8082/
export JWT_AUDIENCE=http://localhost:8082/
export JWT_REALM=jehlomat_local_realm
export SUPER_ADMIN_EMAIL=jehlomat@cesko.digital
export MAILJET_PUBLIC_KEY=cbb81504a06f2fd735db577f09666b7f
export MAILJET_PRIVATE_KEY=fdd479b47c4af6e4d46bb07bf889432d
export FRONTEND_URL=http://localhost:3000/#/
```
6) `cd service-jehlomat` 
7) `../gradlew shadowJar` 
8) `java -jar build/libs/service-jehlomat-all.jar -config=./src/test/resources/application.conf`


## Run hybrid backend application with Docker

> This approach is useful mostly for FE development. By hybrid means, the BE service will be run locally but the database will be run via docker, so it will not be necessary to install the DB and run it 1. locally.

1. In the root run `docker compose up` or `docker compose up --build` for rebuilding docker container with for example when new DB schema is needed
2. Create relations:
    1. Run `docker ps`, you should see a table with just one row. It is your running container. Remember its container id, we will need it in the next step
    2. Run commands:
    ```shell
    docker exec -it <container_id> psql postgresql://jehlomat:jehlomat@localhost:5432/jehlomat -f ../service-jehlomat/src/main/resources/sql/postgis.sql
    docker exec -it <container_id> psql postgresql://jehlomat:jehlomat@localhost:5432/jehlomat -f ../service-jehlomat/src/test/resources/obce.sql
    docker exec -it <container_id> psql postgresql://jehlomat:jehlomat@localhost:5432/jehlomat -f ../service-jehlomat/src/test/resources/mc.sql
    docker exec -it <container_id> psql postgresql://jehlomat:jehlomat@localhost:5432/jehlomat -f ../service-jehlomat/src/test/resources/okres.sql
    docker exec -it <container_id> psql postgresql://jehlomat:jehlomat@localhost:5432/jehlomat -f ../service-jehlomat/src/main/resources/sql/create_table.sql
    docker exec -it <container_id> psql postgresql://jehlomat:jehlomat@localhost:5432/jehlomat -f ../service-jehlomat/src/main/resources/sql/insert_super_admin.sql
    ```
3. Set env variables
```shell
export DATABASE_HOST=localhost
export DATABASE_PORT=5432
export DATABASE_USERNAME=jehlomat
export PGPASSWORD=jehlomat
export DATABASE_NAME=jehlomat
export JWT_ISSUER=http://localhost:8082/
export JWT_AUDIENCE=http://localhost:8082/
export JWT_REALM=jehlomat_local_realm
export SUPER_ADMIN_EMAIL=jehlomat@cesko.digital
export MAILJET_PUBLIC_KEY=cbb81504a06f2fd735db577f09666b7f
export MAILJET_PRIVATE_KEY=fdd479b47c4af6e4d46bb07bf889432d
```
6. `cd service-jehlomat`
7. `../gradlew shadowJar`  # builds launchable jar with all dependencies
8. `java -jar build/libs/service-jehlomat-all.jar -config=./src/test/resources/application.conf`  # launch application https://ktor.io/docs/configurations.html#command-line

## Most common errors

### Kotlin could not find the required JDK tools in the Java installation  used by Gradle. Make sure Gradle is running on a JDK, not JRE.

Make sure Java 8 SDK is installed.

### Could not initialize class org.jetbrains.kotlin.com.intellij.pom.java.LanguageLevel

Version compatibility of Java and Kotlin is incorrect. Make sure the proper versions are installed.

### Receive Error 500 on a server request and/or Relation "users" does not exist.

Make sure you did point 5 in "Run" block.

# Swagger UI

```
http://localhost:8082/swagger-ui/index.html?url=/static/swagger.yaml#/default
```

# DB extensions

### Postgis
https://postgis.net/install/

### RUIAN

https://geoportal.cuzk.cz/zakazky/SPH/SPH_SHP_WGS84.zip

```shell
unzip SPH_SHP_WGS84.zip
cd WGS84

ogr2ogr -f "PostgreSQL" PG:"host=localhost user=<USER> password=<PASSWORD> dbname=<DBNAME>" SPH_OBEC.shp
ogr2ogr -f "PostgreSQL" PG:"host=localhost user=<USER> password=<PASSWORD> dbname=<DBNAME>" SPH_MC.shp
ogr2ogr -f "PostgreSQL" PG:"host=localhost user=<USER> password=<PASSWORD> dbname=<DBNAME>" SPH_OKRES.shp
```

# Create test dataset

```shell
pg_dump -t 'sph_*' jehlomat > db.sql
```

Remove lines for sph_* tables to make small test sample

```shell
psql -h localhost -p 5432 -U jehlomat -d jehlomat < db.sql
```

# Frontend dev

Before commit to git please run `npm run fix` and `npm run lint`. Feel free to commit if both commands are successful.

# CI/CD Pipeline

Before merging PR to master, the check to test code is required. For both FE and BE.

There is an extra action to ignore this test check for changes outside of project. `.github/workflows/test_ignore_outside_projects.yml`

# Database migration 

Steps how to migrate from old Jehlomat DB (MySQL) to new Jehlomat DB (PostreSQL)

1) Install MySQL on your local computer
2) Download old Jehlomat dump from 
3) Add 
```
CREATE DATABASE IF NOT EXISTS jehlomat_migration;
USE jehlomat_migration;
```
to the beginning of the file `2022-03-03_jehlomat-cz.sql`

4) Load old data:
```shell
mysql -u <USER> < 2022-03-03_jehlomat-cz.sql
```
6) Migrate organizations - run command in MySQL client on old Jehlomat data
```
USE jehlomat_migration;
select id, name, true from user INTO OUTFILE 'organization.tsv' FIELDS TERMINATED BY '\t' OPTIONALLY ENCLOSED BY '"' LINES TERMINATED BY '\n';
```
7) Import data to new schema - run command in PostreSQL client to import organizations to new schema
```
\COPY organizations FROM 'organization.tsv' DELIMITER E'\t' CSV;
```
8) Migrate users as admins - run command in MySQL client on old Jehlomat data
```
USE jehlomat_migration;
select id as user_id, username as email, username as username, password as password, true as verified, '' as verification_code, id as organization_id, 'NULL' as team_id, false as is_admin from user INTO OUTFILE 'users.tsv' FIELDS TERMINATED BY '\t' OPTIONALLY ENCLOSED BY '"' LINES TERMINATED BY '\n';
```

9) Run script migration/transform_users.py on MySQL dump users.tsv

```
python3 migration/transform_users.py users.tsv
```

10) Import data to new schema - run command in PostreSQL client to import organizations to new schema
```
psql -h localhost -p 5432 -U jehlomat -d jehlomat
\COPY users FROM 'users_transformed.tsv' DELIMITER E'\t' CSV NULL 'NULL';
```

11) Migrate occurrences, create temporary table - run command in MySQL client on old Jehlomat data

```
USE jehlomat_migration;
CREATE TABLE occurrence (
  id INT NOT NULL PRIMARY KEY ,
  user_id INT NOT NULL,
  count INT NOT NULL,
  latitude double precision NOT NULL,
  longitude double precision NOT NULL,
  note TEXT,
  created TIMESTAMP NOT NULL
);
```

12) Migrate occurrences, export data to occurrence.tsv - run command in MySQL client on old Jehlomat data
```
USE jehlomat_migration;
select 
	id as id,
	user_id as user_id,
	count as count,
	latitude as latitude,
	longitude as longitude,
	IFNULL(note,"") as note,
	created as created
from occurrence INTO OUTFILE 'occurrence.tsv' FIELDS TERMINATED BY '\t' OPTIONALLY ENCLOSED BY '"' LINES TERMINATED BY '\n';
```

13) Remove quotes to correct CSV

remove \" on line: "Nalezená použitá injekční jehla ... ,, Na Číně\" v ČB."
and
remove \" on line:  "Park u kostela, prostřední !květináče\""

14) Import data to temporary table - run command in PostreSQL client

```
\COPY occurrence FROM '/Users/radekludacka/Downloads/occurrence.tsv' DELIMITER E'\t' CSV NULL 'NULL';
```

15) Import locations - run command in PostreSQL client to import organizations to new schema

```roomsql
INSERT INTO locations (
    okres,
    okres_name,
    obec,
    obec_name,
    mestka_cast,
    mestka_cast_name
)
SELECT
    okres_table.kod_lau1 as okres,
    okres_table.nazev_lau1 as okres_name,
    obec_table.kod_lau2::int as obec,
    obec_table.nazev_lau2 as obec_name,
    COALESCE(kod_mc::int, -2147483648) as mestka_cast,
    COALESCE(nazev_mc, '') as mestka_cast_name
FROM (
    SELECT
        *,
        POINT(longitude, latitude)::geometry as geom
    FROM
        occurrence
) as o
JOIN sph_okres okres_table ON ST_Within(o.geom, okres_table.wkb_geometry)
LEFT JOIN sph_mc ON ST_Within(o.geom, sph_mc.wkb_geometry)
JOIN sph_obec obec_table ON ST_Within(o.geom, obec_table.wkb_geometry)
ON CONFLICT (okres, obec, mestka_cast) DO NOTHING
;
```

16) Import occurrences to temporary table with geometries - run command in PostreSQL client
```roomsql
INSERT INTO syringes_no_location (
    id,
    created_at,
    created_by,
    reserved_till,
    reserved_by,
    demolished_at,
    demolished_by,
    demolisher_type,
    photo,
    count_,
    note,
    gps_coordinates,
    demolished,
    kod_lau1,
    kod_mc,
    kod_lau2
)
SELECT
    substring(md5(random()::text), 0, 8) as id,
    extract(epoch from created) as created_at,
    user_id as created_by,
    extract(epoch from created) as reserved_till,
    user_id as reserved_by,
    extract(epoch from created) as demolished_at,
    user_id as demolished_by,
    'USER' as demolisher_type,
    '' as photo,
    count as count_,
    note as note,
    CONCAT(latitude, ' ', longitude) as gps_coordinates,
    true as demolished,
    okres_table.kod_lau1 as kod_lau1,
    sph_mc.kod_mc::int as kod_mc,
    obec_table.kod_lau2::int as kod_lau2
FROM (
    SELECT
        *,
        POINT(longitude, latitude)::geometry as geom
    FROM
        occurrence
) as o
JOIN sph_okres okres_table ON ST_Within(o.geom, okres_table.wkb_geometry)
JOIN sph_obec obec_table ON ST_Within(o.geom, obec_table.wkb_geometry)
LEFT JOIN sph_mc ON ST_Within(o.geom, sph_mc.wkb_geometry)
;
```

16) Import occurrences to temporary table with geometries

```roomsql
INSERT INTO syringes (
    id,
    created_at,
    created_by,
    reserved_till,
    reserved_by,
    demolished_at,
    demolished_by,
    demolisher_type,
    photo,
    count_,
    note,
    gps_coordinates,
    demolished,
    location_id
)
SELECT
    id,
    created_at,
    created_by,
    reserved_till,
    reserved_by,
    demolished_at,
    demolished_by,
    demolisher_type,
    photo,
    count_,
    note,
    gps_coordinates,
    demolished,
    loc.location_id as location_id
FROM syringes_no_location as o
JOIN locations loc ON (
    o.kod_lau1 = loc.okres
    AND COALESCE(o.kod_mc, -2147483648) = loc.mestka_cast
    AND o.kod_lau2 = loc.obec
);
```