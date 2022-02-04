-- Enable PostGIS (as of 3.0 contains just geometry/geography)
CREATE EXTENSION IF NOT EXISTS postgis;
-- enable raster support (for 3+)
CREATE EXTENSION IF NOT EXISTS postgis_raster;
-- Enable Topology
CREATE EXTENSION IF NOT EXISTS postgis_topology;
-- Enable PostGIS Advanced 3D
-- and other geoprocessing algorithms
-- sfcgal not available with all distributions (not in AWS)
-- CREATE EXTENSION IF NOT EXISTS postgis_sfcgal;
-- fuzzy matching needed for Tiger
CREATE EXTENSION IF NOT EXISTS fuzzystrmatch;
-- rule based standardizer
CREATE EXTENSION IF NOT EXISTS address_standardizer;
-- example rule data set
CREATE EXTENSION IF NOT EXISTS address_standardizer_data_us;
-- Enable US Tiger Geocoder
CREATE EXTENSION IF NOT EXISTS postgis_tiger_geocoder;