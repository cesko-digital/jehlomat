CREATE TABLE public.users(
    email TEXT NOT NULL,
    password TEXT NOT NULL,
    verified boolean NOT NULL,
    teamName TEXT NOT NULL
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
)