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
    mestka_cast TEXT NOT NULL,

    CONSTRAINT unique_location UNIQUE (okres, obec, mestka_cast)
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
    id VARCHAR(8) PRIMARY KEY,
    created_at BIGINT NOT NULL,
    created_by INT,
    reserved_at BIGINT,
    reserved_by INT,
    demolished_at BIGINT,
    demolished_by INT,
    demolisher_type TEXT NOT NULL,
    photo TEXT,
    count_ INT NOT NULL,
    note TEXT,
    gps_coordinates TEXT NOT NULL,
    demolished BOOLEAN NOT NULL,

    CONSTRAINT fk_created_by_user FOREIGN KEY(created_by)
        REFERENCES users(user_id),
    CONSTRAINT fk_reserved_by_user FOREIGN KEY(reserved_by)
        REFERENCES users(user_id),
    CONSTRAINT fk_demolished_by_user FOREIGN KEY(demolished_by)
        REFERENCES users(user_id)
);