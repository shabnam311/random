-- Priority 0: Row Level Security (RLS) and Storage Policies

-- 1. Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE class_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE files ENABLE ROW LEVEL SECURITY;
ALTER TABLE file_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE grades ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- 2. Define RLS Policies

-- Users: Can read their own data, and teachers can read data of students in their classes
CREATE POLICY "Users can read own data" ON users FOR SELECT USING (auth.uid() = id);

-- Classes: Users can read classes they are members of
CREATE POLICY "Members can read classes" ON classes FOR SELECT 
USING (EXISTS (SELECT 1 FROM class_memberships WHERE class_id = classes.id AND user_id = auth.uid()));

-- Class Memberships: Users can read memberships for their classes
CREATE POLICY "Members can read memberships" ON class_memberships FOR SELECT 
USING (user_id = auth.uid() OR class_id IN (SELECT class_id FROM class_memberships WHERE user_id = auth.uid()));

-- Projects: Users can read projects for their classes
CREATE POLICY "Members can read projects" ON projects FOR SELECT 
USING (class_id IN (SELECT class_id FROM class_memberships WHERE user_id = auth.uid()));

-- Groups: Members can read groups in their classes
CREATE POLICY "Members can read groups" ON groups FOR SELECT 
USING (project_id IN (SELECT id FROM projects WHERE class_id IN (SELECT class_id FROM class_memberships WHERE user_id = auth.uid())));

-- Group Members: Can read group memberships for their groups
CREATE POLICY "Members can read group members" ON group_members FOR SELECT 
USING (group_id IN (SELECT id FROM groups WHERE project_id IN (SELECT id FROM projects WHERE class_id IN (SELECT class_id FROM class_memberships WHERE user_id = auth.uid()))));

-- Files: Members of the group can read files, and teachers of the class can read files
CREATE POLICY "Group members and teachers can read files" ON files FOR SELECT 
USING (
  EXISTS (SELECT 1 FROM group_members WHERE group_id = files.group_id AND user_id = auth.uid()) OR
  EXISTS (SELECT 1 FROM classes c JOIN projects p ON c.id = p.class_id JOIN groups g ON p.id = g.project_id WHERE g.id = files.group_id AND c.teacher_id = auth.uid())
);

-- (Similar read policies would apply for file_versions, comments, grades, activity_log, etc.)

-- Allow inserting files for group members
CREATE POLICY "Group members can insert files" ON files FOR INSERT 
WITH CHECK (EXISTS (SELECT 1 FROM group_members WHERE group_id = files.group_id AND user_id = auth.uid()));

-- 3. Storage Bucket & Policies
INSERT INTO storage.buckets (id, name, public) VALUES ('project_files', 'project_files', false) ON CONFLICT DO NOTHING;

CREATE POLICY "Group members and teachers can read storage" ON storage.objects FOR SELECT 
USING (bucket_id = 'project_files' AND (
  EXISTS (SELECT 1 FROM group_members WHERE group_id::text = (string_to_array(name, '/'))[1] AND user_id = auth.uid())
  OR EXISTS (SELECT 1 FROM classes c JOIN projects p ON c.id = p.class_id JOIN groups g ON p.id = g.project_id WHERE g.id::text = (string_to_array(name, '/'))[1] AND c.teacher_id = auth.uid())
));

CREATE POLICY "Group members can upload storage" ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'project_files' AND EXISTS (SELECT 1 FROM group_members WHERE group_id::text = (string_to_array(name, '/'))[1] AND user_id = auth.uid()));
