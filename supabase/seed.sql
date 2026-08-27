-- ClassVault Seed Data
-- One realistic demo class: one teacher, twelve students, four groups

-- (Assume users are already created via Supabase Auth in a real environment)
-- For local testing, we insert dummy users.
INSERT INTO auth.users (id, email) VALUES 
('t1-uuid', 'teacher@school.edu'),
('s1-uuid', 's1@school.edu'),
('s2-uuid', 's2@school.edu'),
('s3-uuid', 's3@school.edu'),
('s4-uuid', 's4@school.edu'),
('s5-uuid', 's5@school.edu');

INSERT INTO users (id, name, email, role) VALUES 
('t1-uuid', 'S. Kapoor', 'teacher@school.edu', 'teacher'),
('s1-uuid', 'Rhea Sen', 's1@school.edu', 'student'),
('s2-uuid', 'Dev Prabhu', 's2@school.edu', 'student'),
('s3-uuid', 'Amara Ng', 's3@school.edu', 'student'),
('s4-uuid', 'Owen Cole', 's4@school.edu', 'student'),
('s5-uuid', 'Priya Iyer', 's5@school.edu', 'student');

-- Class
INSERT INTO classes (id, teacher_id, name, subject_label, join_code)
VALUES ('c1-uuid', 't1-uuid', 'Urban Water Systems', 'Environmental Design · Term 2', 'ENV24X');

-- Class Memberships
INSERT INTO class_memberships (class_id, user_id, role_in_class) VALUES 
('c1-uuid', 't1-uuid', 'teacher'),
('c1-uuid', 's1-uuid', 'student'),
('c1-uuid', 's2-uuid', 'student'),
('c1-uuid', 's3-uuid', 'student'),
('c1-uuid', 's4-uuid', 'student'),
('c1-uuid', 's5-uuid', 'student');

-- Project
INSERT INTO projects (id, class_id, title, description, deadline_utc, grading_scheme)
VALUES ('p1-uuid', 'c1-uuid', 'Urban Water Systems Proposal', 'Design a stormwater management proposal...', '2026-12-01 18:00:00+00', 'letter');

-- Groups
INSERT INTO groups (id, project_id, name, group_code, status) VALUES 
('g1-uuid', 'p1-uuid', 'Delta Four', 'DEL4', 'draft'),
('g2-uuid', 'p1-uuid', 'Riverbank Collective', 'RIVC', 'submitted');

-- Group Members
INSERT INTO group_members (group_id, user_id, is_leader) VALUES 
('g1-uuid', 's1-uuid', true),
('g1-uuid', 's2-uuid', false),
('g1-uuid', 's3-uuid', false),
('g2-uuid', 's4-uuid', true),
('g2-uuid', 's5-uuid', false);

-- Activity Log Example
INSERT INTO activity_log (group_id, actor_id, event_type, metadata_json) VALUES 
('g1-uuid', 's1-uuid', 'group_created', '{"note": "Rhea created the group"}'),
('g1-uuid', 's3-uuid', 'file_uploaded', '{"filename": "site-plan-diagram.png"}');
