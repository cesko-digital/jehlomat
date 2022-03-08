# Run backend application locally

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
  psql -h localhost -p 5432 -U jehlomat -d jehlomat -f ./service-jehlomat/src/main/resources/sql/insert_super_admin.sql
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
export MAILJET_PUBLIC_KEY=public-key-for-mailjet
export MAILJET_PRIVATE_KEY=private-key-for-mailjet
```
6) Run application
```shell
./gradlew run --parallel
```

# Run hybrid backend application

> This approach is useful mostly for FE development.

By hybrid means, the BE service will be run locally but the database will be run via docker, so it will not be necessary to install the DB and run it 1. locally.

## Installation

1. Install [Java 8 SDK](https://www.oracle.com/java/technologies/downloads/#java8)
2. Install Kotlin 1.3.72 (preferable) or 1.4.30
3. Install Docker (to run DB)
4. Install Gradle (to run BE Kotlin services)

## Run

1. Set environment variables from **Run backend application locally** block
2. Checkout to`docker-local-dev` (only to run docker)
3. In the root run `docker compose up`
4. Save somewhere the content of the `application.conf`
5. Create `users` relations:
    1. Run `docker ps`, you should see a table with just one row. It is your running container. Remember its container id, we will need it in the next step
    2. Run commands from **Run backend application locally** block, point 3 and 4, but with a prefix `docker exec -it <container_id> <command>`, it will let execute postgre commands **inside** the container. For example:
    ```shell
    docker exec -it 0c30405530ec psql -h localhost -p 5432 -U jehlomat -d jehlomat -f ./service-jehlomat/src/main/resources/sql/postgis.sql
    ```
6. Checkout back to your branch
7. Replace the content of the `application.conf` with the new settings from point 4
8. In the root run `./gradlew run --parallel`

## Most common errors

### Kotlin could not find the required JDK tools in the Java installation  used by Gradle. Make sure Gradle is running on a JDK, not JRE.

Make sure Java 8 SDK is installed.

### Could not initialize class org.jetbrains.kotlin.com.intellij.pom.java.LanguageLevel

Version compatibility of Java and Kotlin is incorrect. Make sure the proper versions are installed.


### Receive Error 500 on a server request and/or Relation "users" does not exist.

Makr sure you did point 5 in "Run" block.

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