insert into organizations (name, verified) values ('Magdalena', true);
insert into users (email, username, password, verified, verification_code, organization_id, team_id, is_admin)
    SELECT 'super@admin.cz', 'Super Admin', '$2a$10$DL6.hAhX8oFfQKrR/dzxcOMHAAkt7ifW1mPSCEaPlvB0dTfECeNIG', true, '', org.organization_id , null, true
        FROM organizations as org
        where name = 'Magdalena';