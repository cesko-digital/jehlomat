SELECT id, nazev_lau1 FROM geo_country WHERE ST_Within('POINT(16.65706045165786 49.20842905085805)'::geometry, geo_country.geom);
