# Run application locally

```shell
./gradlew run --parallel
```

# DB extensions

### Postgis
https://postgis.net/install/

### RUIAN

https://vdp.cuzk.cz/vdp/ruian/vymennyformat/vyhledej?vf.pu=S&_vf.pu=on&_vf.pu=on&vf.cr=U&vf.up=ST&vf.ds=Z&vf.vu=Z&_vf.vu=on&_vf.vu=on&_vf.vu=on&_vf.vu=on&search=Vyhledat

```shell
ogr2ogr -f PostgreSQL PG:dbname=jehlomat 20210930_ST_UZSZ.xml
```

### Format RUIAN

```shell
xmllint 20210930_ST_UZSZ.xml | XMLLINT_INDENT=$'\t' xmllint --format --encode utf-8 - > 20210930_ST_UZSZ_formated.xml
```