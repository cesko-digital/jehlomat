# Run backend application

## Installation

1. Install [Java 8 SDK](https://www.oracle.com/java/technologies/downloads/#java8) Java 1.8 is necessary, other version are not fully compatible with kotlin
2. Install Kotlin 1.3.72 (preferable) or 1.4.30
3. Install Docker (to run DB)
4. Install Gradle (to run BE Kotlin services)

## Database without docker
>If you want to run the database in docker, see bellow.

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
NOTE: If you want to create more users or organizations, you can copy the insert_super_admin.sql script and change required values.

EXAMPLE:
``` sql
insert into users (email, username, password, status, verification_code, organization_id, team_id, is_admin)
    SELECT 'petr2@cesko.digital', 'Petr2', '$2a$10$DL6.hAhX8oFfQKrR/dzxcOMHAAkt7ifW1mPSCEaPlvB0dTfECeNIG', 1, '', org.organization_id , null, false
        FROM organizations as org
        where name = 'Org1';
```
This sql command inserts a new user with name Petr2 and password SuperAdmin1. The user will be added to the Org1 organization.

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

1. In the root run `docker-compose up` or `docker-compose up --build` for rebuilding docker container with for example when new DB schema is needed
2. Create relations:

   If you have installed `psql` tool, you can run commands in [Database without docker](#database-without-docker) and skip this part.

    1. Run `docker ps`, you should see a table with just one row. It is your running container.
    2. Run commands from project root:
   ```shell
   docker exec -it <container_id> psql postgresql://jehlomat:jehlomat@localhost:5432/jehlomat -f ../service-jehlomat/src/main/resources/sql/postgis.sql
   docker exec -it <container_id> psql postgresql://jehlomat:jehlomat@localhost:5432/jehlomat -f ../service-jehlomat/src/test/resources/obce.sql
   docker exec -it <container_id> psql postgresql://jehlomat:jehlomat@localhost:5432/jehlomat -f ../service-jehlomat/src/main/resources/mc.sql
   docker exec -it <container_id> psql postgresql://jehlomat:jehlomat@localhost:5432/jehlomat -f ../service-jehlomat/src/main/resources/okres.sql
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

## Graphic tool for database connection
There is a lot of graphic tools for database connection. It depends on your preferences which one you want to use. I can recommend [pgAdmin](https://www.pgadmin.org/)(web application), [DBeaver](https://dbeaver.io/)(desktop application).
In any case, you'll need to know database host, port, username, password and database name.
There are many tutorials on the internet on how to install the tools and connect to the database.
1. DBeaver [tutorial](https://hevodata.com/learn/dbeaver-postgresql/)
2. pgAdmin [tutorial](https://medium.com/@malexmad/how-to-use-pgadmin-a9addc7ff46c)

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

# CI/CD Pipeline

Before merging PR to master, the check to test code is required. For both FE and BE.

There is an extra action to ignore this test check for changes outside of project. `.github/workflows/test_ignore_outside_projects.yml`
