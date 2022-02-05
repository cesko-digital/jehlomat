DROP TABLE IF EXISTS public.sph_mc CASCADE;

CREATE TABLE public.sph_mc (
    ogc_fid integer NOT NULL,
    id numeric(24,5),
    kod_lau1 character varying(48),
    kod_lau2 numeric(10,0),
    kod_mc numeric(10,0),
    nazev_mc character varying(192),
    kod_so numeric(10,0),
    wkb_geometry public.geometry(Polygon)
);

ALTER TABLE ONLY public.sph_mc
    ADD CONSTRAINT sph_mc_pkey PRIMARY KEY (ogc_fid);

CREATE INDEX sph_mc_wkb_geometry_geom_idx ON public.sph_mc USING gist (wkb_geometry);
