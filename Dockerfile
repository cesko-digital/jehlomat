FROM ubuntu:latest

RUN apt-get update && apt-get install -y \
    git\
    wget\
    curl
    
RUN psql -h localhost -p 5432 -U jehlomat -d jehlomat -f ./service-jehlomat/src/main/resources/postgis.sql
RUN psql -h localhost -p 5432 -U jehlomat -d jehlomat -f ./service-jehlomat/src/test/resources/obce.sql
RUN  psql -h localhost -p 5432 -U jehlomat -d jehlomat -f ./service-jehlomat/src/test/resources/mc.sql
RUN psql -h localhost -p 5432 -U jehlomat -d jehlomat -f ./service-jehlomat/src/test/resources/okres.sql
RUN psql -h localhost -p 5432 -U jehlomat -d jehlomat -f ./service-jehlomat/src/main/resources/create_table.sql
RUN psql -h localhost -p 5432 -U jehlomat -d jehlomat -f ./service-jehlomat/src/main/resources/insert_super_admin.sql