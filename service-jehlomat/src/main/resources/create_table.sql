DROP TABLE IF EXISTS public.syringes CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;
DROP TABLE IF EXISTS public.teams CASCADE;
DROP TABLE IF EXISTS public.organizations CASCADE;
DROP TABLE IF EXISTS public.locations CASCADE;

CREATE TABLE public.organizations(
    organization_id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    verified BOOLEAN NOT NULL
);

CREATE TABLE public.locations(
    location_id SERIAL PRIMARY KEY,
    okres TEXT NOT NULL,
    obec TEXT NOT NULL,
    mestka_cast TEXT NOT NULL
);


CREATE TABLE public.teams(
    team_id SERIAL PRIMARY KEY,
    name TEXT not null,
    organization_id INT NOT NULL,
    location_id INT NOT NULL,

    CONSTRAINT fk_organization FOREIGN KEY(organization_id)
        REFERENCES organizations(organization_id),
    CONSTRAINT fk_location FOREIGN KEY(location_id)
        REFERENCES locations(location_id)
);

CREATE TABLE public.users(
    user_id SERIAL PRIMARY KEY,
    email TEXT NOT NULL,
    password TEXT NOT NULL,
    verified BOOLEAN NOT NULL,
    organization_id INT NOT null,
    team_id INT,
    is_admin BOOLEAN,

    CONSTRAINT fk_organization FOREIGN KEY(organization_id)
        REFERENCES organizations(organization_id),
    CONSTRAINT fk_team FOREIGN KEY(team_id)
        REFERENCES teams(team_id)
);

CREATE TABLE public.syringes(
    id SERIAL PRIMARY KEY,
    timestamp_ BIGINT,
    user_id INT NOT NULL,
    photo TEXT,
    count_ INT NOT NULL,
    note TEXT,
    demolisher_type TEXT NOT NULL,
    gps_coordinates TEXT NOT NULL,
    demolished BOOLEAN NOT NULL,

    CONSTRAINT fk_user FOREIGN KEY(user_id)
        REFERENCES users(user_id)
);