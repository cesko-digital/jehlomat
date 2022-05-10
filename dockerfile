FROM kartoza/postgis:14-3.1

RUN apt-get update && apt-get install -y \
    git \
    nano