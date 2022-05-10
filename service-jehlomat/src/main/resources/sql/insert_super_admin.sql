insert into organizations (name, verified) values ('Magdalena', true);
insert into users (email, username, password, status, verification_code, organization_id, team_id, is_admin)
    SELECT 'jehlomat@cesko.digital', 'Super Admin', '$2a$10$DL6.hAhX8oFfQKrR/dzxcOMHAAkt7ifW1mPSCEaPlvB0dTfECeNIG', 1, '', org.organization_id , null, true
        FROM organizations as org
        where name = 'Magdalena';