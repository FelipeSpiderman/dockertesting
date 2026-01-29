--USERS



insert into users (id, email,first_name,last_name, password)
values ('ba804cb9-fa14-42a5-afaf-be488742fc54', 'admin@example.com', 'James','Bond', '$2a$10$TM3PAYG3b.H98cbRrHqWa.BM7YyCqV92e/kUTBfj85AjayxGZU7d6' ), -- Password: 1234
('0d8fa44c-54fd-4cd0-ace9-2a7da57992de', 'user@example.com', 'Tyler','Durden', '$2a$10$TM3PAYG3b.H98cbRrHqWa.BM7YyCqV92e/kUTBfj85AjayxGZU7d6') -- Password: 1234
 ON CONFLICT DO NOTHING;

INSERT INTO event (
    id,
    event_name,
    event_description,
    event_type,
    start_date_time,
    end_date_time,
    event_location,
    user_id
)
VALUES
    (
        '1a3f2c6e-2c3c-4b3b-9e4e-1c9c92f1b101',
        'Team Sync',
        'Weekly team sync meeting',
        'MEETING',
        NOW() + INTERVAL '1 day',
        NOW() + INTERVAL '1 day 1 hour',
        'zürich office',
        'ba804cb9-fa14-42a5-afaf-be488742fc54'
    ),
    (
        '2b4a8f9e-3e92-4c4d-bc8c-2e0eaa1c1102',
        'Project Kickoff',
        'Initial project kickoff discussion',
        'MEETING',
        NOW() + INTERVAL '2 days',
        NOW() + INTERVAL '2 days 2 hours',
        'zürich office',
        'ba804cb9-fa14-42a5-afaf-be488742fc54'
    ),
    (
        '3c5d9a2b-6f1e-4a22-8f6d-3f1bb2d31103',
        'Client Call',
        'Call with external client',
        'WORKSHOP',
        NOW() + INTERVAL '3 days',
        NOW() + INTERVAL '3 days 1 hour',
        'remote',
        'ba804cb9-fa14-42a5-afaf-be488742fc54'
    ),
    (
        '4d6e1b3c-7a22-4d3f-a21e-4a2c3d441104',
        'Design Review',
        'Review of new UI designs',
        'MEETING',
        NOW() + INTERVAL '4 days',
        NOW() + INTERVAL '4 days 1 hour',
        'zürich office',
        'ba804cb9-fa14-42a5-afaf-be488742fc54'
    ),
    (
        '5e7f2c4d-8b33-4e44-bc2f-5b3d4e551105',
        'Sprint Planning',
        'Planning tasks for next sprint',
        'WORKSHOP',
        NOW() + INTERVAL '5 days',
        NOW() + INTERVAL '5 days 2 hours',
        'zürich office',
        'ba804cb9-fa14-42a5-afaf-be488742fc54'
    ),
    (
        '6f812d5e-9c44-4f55-9d30-6c4e5f661106',
        'Tech Talk',
        'Internal knowledge sharing session',
        'WORKSHOP',
        NOW() + INTERVAL '6 days',
        NOW() + INTERVAL '6 days 1 hour',
        'conference room A',
        'ba804cb9-fa14-42a5-afaf-be488742fc54'
    ),
    (
        '70823e6f-a055-4066-8e41-7d5f60771107',
        '1:1 Meeting',
        'Monthly one-on-one',
        'MEETING',
        NOW() + INTERVAL '7 days',
        NOW() + INTERVAL '7 days 30 minutes',
        'zürich office',
        'ba804cb9-fa14-42a5-afaf-be488742fc54'
    ),
    (
        '81934f70-b166-4177-bf52-8e6071881108',
        'Product Demo',
        'Demo of new product features',
        'WORKSHOP',
        NOW() + INTERVAL '8 days',
        NOW() + INTERVAL '8 days 1 hour',
        'demo room',
        'ba804cb9-fa14-42a5-afaf-be488742fc54'
    ),
    (
        '92a45081-c277-4288-a063-9f7182991109',
        'Retrospective',
        'Sprint retrospective meeting',
        'MEETING',
        NOW() + INTERVAL '9 days',
        NOW() + INTERVAL '9 days 1 hour',
        'zürich office',
        'ba804cb9-fa14-42a5-afaf-be488742fc54'
    ),
    (
        'a3b56192-d388-4399-b174-a08293aa1110',
        'Planning Session',
        'Quarterly planning session',
        'WORKSHOP',
        NOW() + INTERVAL '10 days',
        NOW() + INTERVAL '10 days 3 hours',
        'strategy room',
        'ba804cb9-fa14-42a5-afaf-be488742fc54'
    ),
    (
        'b4c672a3-e499-44aa-c285-b193a4bb1111',
        'All Hands',
        'Company-wide all hands meeting',
        'MEETING',
        NOW() + INTERVAL '11 days',
        NOW() + INTERVAL '11 days 1 hour',
        'main hall',
        'ba804cb9-fa14-42a5-afaf-be488742fc54'
    )
    ON CONFLICT DO NOTHING;


--ROLES
INSERT INTO role(id, name)
VALUES ('d29e709c-0ff1-4f4c-a7ef-09f656c390f1', 'DEFAULT'),
('ab505c92-7280-49fd-a7de-258e618df074', 'ADMIN'),
('c6aee32d-8c35-4481-8b3e-a876a39b0c02', 'USER'),
('78ebc27a-eddf-46da-b498-d4794e3d2c9c', 'OWNER'),
('5aaa56bd-66a2-4f93-9926-108371df2833', 'COLLABORATOR'),
('ef421859-4347-4ed6-8cc3-2acc69e40fbc', 'ATTENDEE')

ON CONFLICT DO NOTHING;

--AUTHORITIES
INSERT INTO authority(id, name)
VALUES ('2ebf301e-6c61-4076-98e3-2a38b31daf86', 'USER_CREATE'),
('76d2cbf6-5845-470e-ad5f-2edb9e09a868', 'USER_READ'),
('21c942db-a275-43f8-bdd6-d048c21bf5ab', 'USER_DEACTIVATE')
ON CONFLICT DO NOTHING;
INSERT INTO authority(id, name) VALUES
                                    ('a1c942db-a275-43f8-bdd6-d048c21bf5ab', 'EVENT_CREATE'),
                                    ('b1c942db-a275-43f8-bdd6-d048c21bf5ab', 'EVENT_READ'),
                                    ('c1c942db-a275-43f8-bdd6-d048c21bf5ab', 'EVENT_MODIFY'),
                                    ('d1c942db-a275-43f8-bdd6-d048c21bf5ab', 'EVENT_DELETE')
ON CONFLICT DO NOTHING;

INSERT INTO role_authority(role_id, authority_id)
SELECT
    'ab505c92-7280-49fd-a7de-258e618df074', -- ADMIN
    id
FROM authority
WHERE name LIKE 'EVENT_%'
ON CONFLICT DO NOTHING;

--assign roles to users
insert into users_role (users_id, role_id)
values ('ba804cb9-fa14-42a5-afaf-be488742fc54', 'd29e709c-0ff1-4f4c-a7ef-09f656c390f1'),
       ('0d8fa44c-54fd-4cd0-ace9-2a7da57992de', 'd29e709c-0ff1-4f4c-a7ef-09f656c390f1'),
       ('ba804cb9-fa14-42a5-afaf-be488742fc54', 'ab505c92-7280-49fd-a7de-258e618df074'),
       ('ba804cb9-fa14-42a5-afaf-be488742fc54', 'c6aee32d-8c35-4481-8b3e-a876a39b0c02')
 ON CONFLICT DO NOTHING;

--assign authorities to roles
INSERT INTO role_authority(role_id, authority_id)
VALUES ('d29e709c-0ff1-4f4c-a7ef-09f656c390f1', '2ebf301e-6c61-4076-98e3-2a38b31daf86'),
('ab505c92-7280-49fd-a7de-258e618df074', '76d2cbf6-5845-470e-ad5f-2edb9e09a868'),
('c6aee32d-8c35-4481-8b3e-a876a39b0c02', '21c942db-a275-43f8-bdd6-d048c21bf5ab')
 ON CONFLICT DO NOTHING;
-- =========================
-- USERS
-- =========================
INSERT INTO users (id, email, first_name, last_name, password)
VALUES
    ('ba804cb9-fa14-42a5-afaf-be488742fc54', 'admin@example.com', 'James', 'Bond',
     '$2a$10$TM3PAYG3b.H98cbRrHqWa.BM7YyCqV92e/kUTBfj85AjayxGZU7d6'),
    ('0d8fa44c-54fd-4cd0-ace9-2a7da57992de', 'user@example.com', 'Tyler', 'Durden',
     '$2a$10$TM3PAYG3b.H98cbRrHqWa.BM7YyCqV92e/kUTBfj85AjayxGZU7d6')
ON CONFLICT DO NOTHING;

-- =========================
-- ROLES
-- =========================
INSERT INTO role (id, name)
VALUES
    ('d29e709c-0ff1-4f4c-a7ef-09f656c390f1', 'DEFAULT'),
    ('c6aee32d-8c35-4481-8b3e-a876a39b0c02', 'USER'),
    ('ef421859-4347-4ed6-8cc3-2acc69e40fbc', 'ATTENDEE'),
    ('5aaa56bd-66a2-4f93-9926-108371df2833', 'COLLABORATOR'),
    ('78ebc27a-eddf-46da-b498-d4794e3d2c9c', 'OWNER'),
    ('ab505c92-7280-49fd-a7de-258e618df074', 'ADMIN')
ON CONFLICT DO NOTHING;

-- =========================
-- AUTHORITIES
-- =========================
INSERT INTO authority (id, name)
VALUES
    ('b1c942db-a275-43f8-bdd6-d048c21bf5ab', 'EVENT_READ'),
    ('c1c942db-a275-43f8-bdd6-d048c21bf5ab', 'EVENT_MODIFY'),
    ('d1c942db-a275-43f8-bdd6-d048c21bf5ab', 'EVENT_DELETE')
ON CONFLICT DO NOTHING;

-- =========================
-- ROLE → AUTHORITY MAPPING
-- =========================

-- READ: ATTENDEE, COLLABORATOR, OWNER, ADMIN
INSERT INTO role_authority (role_id, authority_id)
VALUES
    ('ef421859-4347-4ed6-8cc3-2acc69e40fbc', 'b1c942db-a275-43f8-bdd6-d048c21bf5ab'), -- ATTENDEE
    ('5aaa56bd-66a2-4f93-9926-108371df2833', 'b1c942db-a275-43f8-bdd6-d048c21bf5ab'), -- COLLABORATOR
    ('78ebc27a-eddf-46da-b498-d4794e3d2c9c', 'b1c942db-a275-43f8-bdd6-d048c21bf5ab'), -- OWNER
    ('ab505c92-7280-49fd-a7de-258e618df074', 'b1c942db-a275-43f8-bdd6-d048c21bf5ab')  -- ADMIN
ON CONFLICT DO NOTHING;

-- MODIFY: COLLABORATOR, OWNER, ADMIN
INSERT INTO role_authority (role_id, authority_id)
VALUES
    ('5aaa56bd-66a2-4f93-9926-108371df2833', 'c1c942db-a275-43f8-bdd6-d048c21bf5ab'),
    ('78ebc27a-eddf-46da-b498-d4794e3d2c9c', 'c1c942db-a275-43f8-bdd6-d048c21bf5ab'),
    ('ab505c92-7280-49fd-a7de-258e618df074', 'c1c942db-a275-43f8-bdd6-d048c21bf5ab')
ON CONFLICT DO NOTHING;

-- DELETE: OWNER, ADMIN
INSERT INTO role_authority (role_id, authority_id)
VALUES
    ('78ebc27a-eddf-46da-b498-d4794e3d2c9c', 'd1c942db-a275-43f8-bdd6-d048c21bf5ab'),
    ('ab505c92-7280-49fd-a7de-258e618df074', 'd1c942db-a275-43f8-bdd6-d048c21bf5ab')
ON CONFLICT DO NOTHING;

-- =========================
-- ASSIGN ROLES TO USERS
-- =========================
INSERT INTO users_role (users_id, role_id)
VALUES
    ('ba804cb9-fa14-42a5-afaf-be488742fc54', 'ab505c92-7280-49fd-a7de-258e618df074'), -- ADMIN
    ('0d8fa44c-54fd-4cd0-ace9-2a7da57992de', 'ef421859-4347-4ed6-8cc3-2acc69e40fbc')  -- ATTENDEE
ON CONFLICT DO NOTHING;
-- EVENT_CREATE der USER Rolle zuweisen
INSERT INTO role_authority (role_id, authority_id)
VALUES (
           'c6aee32d-8c35-4481-8b3e-a876a39b0c02', -- USER
           'a1c942db-a275-43f8-bdd6-d048c21bf5ab'  -- EVENT_CREATE
       )
ON CONFLICT DO NOTHING;

INSERT INTO users_role (users_id, role_id)
SELECT
    u.id,
    'c6aee32d-8c35-4481-8b3e-a876a39b0c02' -- USER
FROM users u
ON CONFLICT DO NOTHING;
