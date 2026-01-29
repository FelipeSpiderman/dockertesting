-- Insert test events
INSERT INTO event (id, event_name, event_description, event_type, event_location, start_date_time, end_date_time, user_id)
VALUES
    ('1a804cb9-fa14-42a5-afaf-be488742fc54', 'Spring Tech Conference', 'Annual technology conference covering latest trends in software development', 'CONFERENCE', 'Convention Center, Hall A', '2026-03-15 09:00:00', '2026-03-15 17:00:00', 'ba804cb9-fa14-42a5-afaf-be488742fc54'),
    (gen_random_uuid(), 'Team Sprint Planning', 'Q2 sprint planning and backlog refinement session', 'MEETING', 'Office Building, Room 301', '2026-02-20 10:00:00', '2026-02-20 12:00:00', 'ba804cb9-fa14-42a5-afaf-be488742fc54'),
    (gen_random_uuid(), 'React Workshop', 'Hands-on workshop on advanced React patterns and hooks', 'WORKSHOP', 'Training Center, Lab 2', '2026-04-10 13:00:00', '2026-04-10 18:00:00', '0d8fa44c-54fd-4cd0-ace9-2a7da57992de'),
    (gen_random_uuid(), 'Product Launch Event', 'Official launch of our new product line', 'OTHER', 'Grand Hotel, Ballroom', '2026-05-01 18:00:00', '2026-05-01 22:00:00', 'ba804cb9-fa14-42a5-afaf-be488742fc54'),
    (gen_random_uuid(), 'Monthly All-Hands', 'Company-wide monthly update and Q&A', 'MEETING', 'Virtual - Zoom', '2026-02-25 15:00:00', '2026-02-25 16:00:00', 'ba804cb9-fa14-42a5-afaf-be488742fc54'),
    (gen_random_uuid(), 'AI/ML Conference 2026', 'International conference on artificial intelligence and machine learning', 'CONFERENCE', 'Tech Hub, Main Auditorium', '2026-06-20 08:00:00', '2026-06-22 18:00:00', '0d8fa44c-54fd-4cd0-ace9-2a7da57992de'),
    (gen_random_uuid(), 'Docker & Kubernetes Workshop', 'Container orchestration and deployment strategies', 'WORKSHOP', 'DevOps Center, Lab 1', '2026-03-05 09:00:00', '2026-03-05 16:00:00', 'ba804cb9-fa14-42a5-afaf-be488742fc54'),
    (gen_random_uuid(), 'Client Presentation', 'Quarterly business review with key stakeholders', 'MEETING', 'Client Office, Board Room', '2026-02-28 14:00:00', '2026-02-28 16:00:00', '0d8fa44c-54fd-4cd0-ace9-2a7da57992de')
ON CONFLICT DO NOTHING;

-- Get the event IDs for participant assignment
DO $$
    DECLARE
        event1_id uuid;
        event2_id uuid;
        event3_id uuid;
    BEGIN
        SELECT id INTO event1_id FROM event WHERE event_name = 'Spring Tech Conference' LIMIT 1;
        SELECT id INTO event2_id FROM event WHERE event_name = 'Team Sprint Planning' LIMIT 1;
        SELECT id INTO event3_id FROM event WHERE event_name = 'React Workshop' LIMIT 1;

        -- Add participants to events
        IF event1_id IS NOT NULL THEN
            INSERT INTO event_participants (event_id, user_id, role)
            VALUES
                (event1_id, 'ba804cb9-fa14-42a5-afaf-be488742fc54', 'OWNER'),
                (event1_id, '0d8fa44c-54fd-4cd0-ace9-2a7da57992de', 'ATTENDEE')
            ON CONFLICT DO NOTHING;
        END IF;

        IF event2_id IS NOT NULL THEN
            INSERT INTO event_participants (event_id, user_id, role)
            VALUES
                (event2_id, 'ba804cb9-fa14-42a5-afaf-be488742fc54', 'OWNER'),
                (event2_id, '0d8fa44c-54fd-4cd0-ace9-2a7da57992de', 'COLLABORATOR')
            ON CONFLICT DO NOTHING;
        END IF;

        IF event3_id IS NOT NULL THEN
            INSERT INTO event_participants (event_id, user_id, role)
            VALUES
                (event3_id, '0d8fa44c-54fd-4cd0-ace9-2a7da57992de', 'OWNER'),
                (event3_id, 'ba804cb9-fa14-42a5-afaf-be488742fc54', 'ATTENDEE')
            ON CONFLICT DO NOTHING;
        END IF;
    END $$;
