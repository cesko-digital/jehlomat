DROP TABLE IF EXISTS public.sph_okres CASCADE;

CREATE TABLE public.sph_okres (
    ogc_fid integer NOT NULL,
    wkb_geometry bytea,
    id numeric(24,5),
    kod_nuts3 character varying(48),
    kod_lau1 character varying(48),
    nazev_lau1 character varying(128)
);


ALTER TABLE ONLY public.sph_okres
    ADD CONSTRAINT sph_okres_pkey PRIMARY KEY (ogc_fid);

