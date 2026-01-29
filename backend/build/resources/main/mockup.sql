--USERS



insert into users (id, email,first_name,last_name, password)
values ('ba804cb9-fa14-42a5-afaf-be488742fc54', 'admin@example.com', 'James','Bond', '$2a$10$TM3PAYG3b.H98cbRrHqWa.BM7YyCqV92e/kUTBfj85AjayxGZU7d6' ), -- Password: 1234
       ('0d8fa44c-54fd-4cd0-ace9-2a7da57992de', 'user@example.com', 'Tyler','Durden', '$2a$10$TM3PAYG3b.H98cbRrHqWa.BM7YyCqV92e/kUTBfj85AjayxGZU7d6') -- Password: 1234
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

-- =========================
-- ADD 5 USERS + 2 ADMINS
-- =========================

-- USERS
INSERT INTO users (id, email, first_name, last_name, password)
VALUES
    ('11111111-1111-1111-1111-111111111111', 'user1@example.com', 'Alice', 'Smith',
     '$2a$10$TM3PAYG3b.H98cbRrHqWa.BM7YyCqV92e/kUTBfj85AjayxGZU7d6'),
    ('22222222-2222-2222-2222-222222222222', 'user2@example.com', 'Bob', 'Johnson',
     '$2a$10$TM3PAYG3b.H98cbRrHqWa.BM7YyCqV92e/kUTBfj85AjayxGZU7d6'),
    ('33333333-3333-3333-3333-333333333333', 'user3@example.com', 'Carol', 'Williams',
     '$2a$10$TM3PAYG3b.H98cbRrHqWa.BM7YyCqV92e/kUTBfj85AjayxGZU7d6'),
    ('44444444-4444-4444-4444-444444444444', 'user4@example.com', 'David', 'Brown',
     '$2a$10$TM3PAYG3b.H98cbRrHqWa.BM7YyCqV92e/kUTBfj85AjayxGZU7d6'),
    ('55555555-5555-5555-5555-555555555555', 'user5@example.com', 'Eve', 'Davis',
     '$2a$10$TM3PAYG3b.H98cbRrHqWa.BM7YyCqV92e/kUTBfj85AjayxGZU7d6'),

    ('66666666-6666-6666-6666-666666666666', 'admin2@example.com', 'Frank', 'Miller',
     '$2a$10$TM3PAYG3b.H98cbRrHqWa.BM7YyCqV92e/kUTBfj85AjayxGZU7d6'),
    ('77777777-7777-7777-7777-777777777777', 'admin3@example.com', 'Grace', 'Wilson',
     '$2a$10$TM3PAYG3b.H98cbRrHqWa.BM7YyCqV92e/kUTBfj85AjayxGZU7d6')
    ON CONFLICT DO NOTHING;

-- =========================
-- ASSIGN ROLES
-- =========================

INSERT INTO users_role (users_id, role_id)
VALUES
    -- 5 regular users → DEFAULT
    ('11111111-1111-1111-1111-111111111111', 'd29e709c-0ff1-4f4c-a7ef-09f656c390f1'),
    ('22222222-2222-2222-2222-222222222222', 'd29e709c-0ff1-4f4c-a7ef-09f656c390f1'),
    ('33333333-3333-3333-3333-333333333333', 'd29e709c-0ff1-4f4c-a7ef-09f656c390f1'),
    ('44444444-4444-4444-4444-444444444444', 'd29e709c-0ff1-4f4c-a7ef-09f656c390f1'),
    ('55555555-5555-5555-5555-555555555555', 'd29e709c-0ff1-4f4c-a7ef-09f656c390f1'),

    -- 2 admins → DEFAULT + ADMIN
    ('66666666-6666-6666-6666-666666666666', 'd29e709c-0ff1-4f4c-a7ef-09f656c390f1'),
    ('66666666-6666-6666-6666-666666666666', 'ab505c92-7280-49fd-a7de-258e618df074'),

    ('77777777-7777-7777-7777-777777777777', 'd29e709c-0ff1-4f4c-a7ef-09f656c390f1'),
    ('77777777-7777-7777-7777-777777777777', 'ab505c92-7280-49fd-a7de-258e618df074')
    ON CONFLICT DO NOTHING;

-- =========================
-- ADD EVENTS FOR NEW USERS
-- =========================

INSERT INTO event (
    id,
    event_name,
    event_description,
    event_type,
    event_location,
    start_date_time,
    end_date_time,
    user_id
)
VALUES
    (gen_random_uuid(), 'Frontend Guild Meetup',
     'Monthly frontend engineering knowledge sharing session',
     'MEETING',
     'Office Building, Room 210',
     '2026-03-12 14:00:00',
     '2026-03-12 16:00:00',
     '11111111-1111-1111-1111-111111111111'),

    (gen_random_uuid(), 'UX Design Workshop',
     'Interactive workshop focused on modern UX principles',
     'WORKSHOP',
     'Design Studio, Floor 2',
     '2026-04-02 10:00:00',
     '2026-04-02 15:00:00',
     '22222222-2222-2222-2222-222222222222'),

    (gen_random_uuid(), 'Backend Architecture Review',
     'Review of microservice architecture and scaling strategies',
     'MEETING',
     'Virtual - Google Meet',
     '2026-03-22 11:00:00',
     '2026-03-22 13:00:00',
     '33333333-3333-3333-3333-333333333333'),

    (gen_random_uuid(), 'Security Best Practices Seminar',
     'Internal seminar on application and infrastructure security',
     'CONFERENCE',
     'HQ Auditorium',
     '2026-05-10 09:00:00',
     '2026-05-10 17:00:00',
     '66666666-6666-6666-6666-666666666666'),

    (gen_random_uuid(), 'Platform Roadmap Review',
     'Leadership review of the platform roadmap and milestones',
     'MEETING',
     'Executive Conference Room',
     '2026-02-18 16:00:00',
     '2026-02-18 18:00:00',
     '77777777-7777-7777-7777-777777777777')
    ON CONFLICT DO NOTHING;

-- =========================
-- ASSIGN PARTICIPANTS
-- =========================

DO $$
DECLARE
frontend_meetup_id uuid;
    ux_workshop_id uuid;
    backend_review_id uuid;
    security_seminar_id uuid;
    roadmap_review_id uuid;
BEGIN
SELECT id INTO frontend_meetup_id FROM event WHERE event_name = 'Frontend Guild Meetup' LIMIT 1;
SELECT id INTO ux_workshop_id FROM event WHERE event_name = 'UX Design Workshop' LIMIT 1;
SELECT id INTO backend_review_id FROM event WHERE event_name = 'Backend Architecture Review' LIMIT 1;
SELECT id INTO security_seminar_id FROM event WHERE event_name = 'Security Best Practices Seminar' LIMIT 1;
SELECT id INTO roadmap_review_id FROM event WHERE event_name = 'Platform Roadmap Review' LIMIT 1;

-- Frontend Guild Meetup
IF frontend_meetup_id IS NOT NULL THEN
        INSERT INTO event_participants (event_id, user_id, role)
        VALUES
            (frontend_meetup_id, '11111111-1111-1111-1111-111111111111', 'OWNER'),
            (frontend_meetup_id, '22222222-2222-2222-2222-222222222222', 'ATTENDEE'),
            (frontend_meetup_id, '33333333-3333-3333-3333-333333333333', 'ATTENDEE')
        ON CONFLICT DO NOTHING;
END IF;

    -- UX Design Workshop
    IF ux_workshop_id IS NOT NULL THEN
        INSERT INTO event_participants (event_id, user_id, role)
        VALUES
            (ux_workshop_id, '22222222-2222-2222-2222-222222222222', 'OWNER'),
            (ux_workshop_id, '44444444-4444-4444-4444-444444444444', 'COLLABORATOR'),
            (ux_workshop_id, '55555555-5555-5555-5555-555555555555', 'ATTENDEE')
        ON CONFLICT DO NOTHING;
END IF;

    -- Backend Architecture Review
    IF backend_review_id IS NOT NULL THEN
        INSERT INTO event_participants (event_id, user_id, role)
        VALUES
            (backend_review_id, '33333333-3333-3333-3333-333333333333', 'OWNER'),
            (backend_review_id, '11111111-1111-1111-1111-111111111111', 'COLLABORATOR'),
            (backend_review_id, '66666666-6666-6666-6666-666666666666', 'ATTENDEE')
        ON CONFLICT DO NOTHING;
END IF;

    -- Security Seminar (Admin-owned)
    IF security_seminar_id IS NOT NULL THEN
        INSERT INTO event_participants (event_id, user_id, role)
        VALUES
            (security_seminar_id, '66666666-6666-6666-6666-666666666666', 'OWNER'),
            (security_seminar_id, '77777777-7777-7777-7777-777777777777', 'COLLABORATOR'),
            (security_seminar_id, '44444444-4444-4444-4444-444444444444', 'ATTENDEE')
        ON CONFLICT DO NOTHING;
END IF;

    -- Platform Roadmap Review (Admin-owned)
    IF roadmap_review_id IS NOT NULL THEN
        INSERT INTO event_participants (event_id, user_id, role)
        VALUES
            (roadmap_review_id, '77777777-7777-7777-7777-777777777777', 'OWNER'),
            (roadmap_review_id, '66666666-6666-6666-6666-666666666666', 'COLLABORATOR'),
            (roadmap_review_id, '55555555-5555-5555-5555-555555555555', 'ATTENDEE')
        ON CONFLICT DO NOTHING;
END IF;
END $$;
