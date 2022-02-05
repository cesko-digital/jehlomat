DROP TABLE IF EXISTS public.sph_obec CASCADE;

CREATE TABLE public.sph_obec (
    ogc_fid integer NOT NULL,
    wkb_geometry bytea,
    id numeric(24,5),
    kod_lau1 character varying(48),
    kod_orp numeric(10,0),
    kod_opu numeric(10,0),
    kod_lau2 numeric(10,0),
    nazev_lau2 character varying(192)
);

ALTER TABLE ONLY public.sph_obec
    ADD CONSTRAINT sph_obec_pkey PRIMARY KEY (ogc_fid);
