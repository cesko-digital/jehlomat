CREATE TABLE public.users(
    email TEXT NOT NULL,
    password TEXT NOT NULL,
    verified BOOLEAN NOT NULL,
    team_name TEXT NOT NULL
);

CREATE TABLE public.locations(
    id SERIAL PRIMARY KEY,
    okres TEXT NOT NULL,
    obec TEXT NOT NULL,
    mestka_cast TEXT NOT NULL
);

CREATE TABLE public.teams(
    name TEXT PRIMARY KEY,
    organization_name TEXT NOT NULL,
    location_id INT NOT NULL
);

CREATE TABLE public.organizations(
    name TEXT PRIMARY KEY,
    email TEXT NOT NULL,
    password TEXT NOT NULL,
    verified BOOLEAN NOT NULL
);

CREATE TABLE public.syringes(
    id SERIAL PRIMARY KEY,
    timestamp_ BIGINT,
    email TEXT NOT NULL,  -- will be replaced by user id
    photo TEXT,
    count_ INT NOT NULL,
    note TEXT,
    demolisher_type TEXT NOT NULL,
    gps_coordinates TEXT NOT NULL,
    demolished BOOLEAN NOT NULL
);