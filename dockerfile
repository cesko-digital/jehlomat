FROM kartoza/postgis:14-3.1

RUN apt-get update && apt-get install -y \
    git

RUN git clone https://github.com/cesko-digital/jehlomat.git
WORKDIR "jehlomat"