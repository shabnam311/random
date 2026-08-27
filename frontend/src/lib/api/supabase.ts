import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder';

// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseUrl, supabaseKey);

// ------------------------------------------------------------------
// AUTHENTICATION
// ------------------------------------------------------------------

export const auth = {
  async login(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  },

  async signup(email: string, password: string, fullName: string, role: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role: role
        }
      }
    });
    if (error) throw error;
    return data;
  },

  async logout() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
  }
};

// ------------------------------------------------------------------
// CLASSES & DASHBOARD
// ------------------------------------------------------------------

export const classesApi = {
  async getMyClasses() {
    // Example: Join through class_memberships to get classes for current user
    const { data, error } = await supabase
      .from('class_memberships')
      .select('classes(*, teacher:users(name)), role_in_class');
    if (error) throw error;
    return data;
  },
  
  async getTeacherOverview(classId: string) {
    // We join through projects to filter groups by class_id
    const { data, error } = await supabase
      .from('groups')
      .select('*, group_members(*, users(*)), projects!inner(class_id, title)')
      .eq('projects.class_id', classId);
    if (error) throw error;
    return data;
  }
};

// ------------------------------------------------------------------
// GROUP WORKSPACE & FILES
// ------------------------------------------------------------------

export const groupApi = {
  async getGroupDetails(groupId: string) {
    const { data, error } = await supabase
      .from('groups')
      .select('*, projects(*), comments(*), activity_log(*)')
      .eq('id', groupId)
      .single();
    if (error) throw error;
    return data;
  },

  async getFiles(groupId: string) {
    const { data, error } = await supabase
      .from('files')
      .select('*, file_versions(*)')
      .eq('group_id', groupId);
    if (error) throw error;
    return data;
  },

  async uploadFile(groupId: string, file: File, uploaderId: string) {
    // 1. Upload to Storage
    const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, '');
    const filePath = `${groupId}/${Date.now()}_${safeName}`;
    const { data: storageData, error: storageError } = await supabase
      .storage
      .from('project_files')
      .upload(filePath, file);
      
    if (storageError) throw storageError;

    // 2. Insert into files & file_versions tables
    const { data: fileRecord, error: fileError } = await supabase
      .from('files')
      .insert({
        group_id: groupId,
        name: file.name,
        extension: file.name.split('.').pop()?.toUpperCase() || 'FILE'
      })
      .select()
      .single();

    if (fileError) throw fileError;

    const { error: versionError } = await supabase
      .from('file_versions')
      .insert({
        file_id: fileRecord.id,
        uploader_id: uploaderId,
        storage_path: storageData.path,
        size_bytes: file.size,
        version_number: 1
      });

    if (versionError) throw versionError;

    return fileRecord;
  },

  async getDownloadUrl(path: string) {
    const { data, error } = await supabase
      .storage
      .from('project_files')
      .createSignedUrl(path, 60 * 60); // 1 hour
    
    if (error) throw error;
    return data.signedUrl;
  },

  async submitProject(groupId: string) {
    const { data: groupData, error: fetchError } = await supabase
      .from('groups')
      .select('projects(deadline)')
      .eq('id', groupId)
      .single();
    if (fetchError) throw fetchError;

    // We import dynamically to avoid top-level import issues if we don't have it imported at the top
    const { computeSubmissionStatus } = await import('../utils/deadline');
    
    // Fallback if projects relationship isn't returned exactly this way
    const deadlineStr = (groupData as any)?.projects?.deadline || (groupData as any)?.projects?.[0]?.deadline;
    const newStatus = deadlineStr ? computeSubmissionStatus(deadlineStr) : 'submitted';

    const { data, error } = await supabase
      .from('groups')
      .update({ status: newStatus })
      .eq('id', groupId)
      .select()
      .single();
      
    if (error) throw error;
    return data;
  },

  async addComment(groupId: string, body: string, authorId: string) {
    const { error } = await supabase
      .from('comments')
      .insert({
        group_id: groupId,
        author_id: authorId,
        body: body
      });
    if (error) throw error;

    // Trigger notifications for group members
    const { data: members } = await supabase.from('group_members').select('user_id').eq('group_id', groupId);
    if (members) {
      const notifications = members
        .filter(m => m.user_id !== authorId)
        .map(m => ({
          user_id: m.user_id,
          message: 'New comment posted in your group.',
          type: 'feedback',
          link: `/classes/default/group/${groupId}` // Placeholder
        }));
      if (notifications.length > 0) {
        await supabase.from('notifications').insert(notifications);
      }
    }
  },

  async updateGrade(groupId: string, gradeStr: string, status: string, graderId: string) {
    // 1. Update group status
    const { error: updateError } = await supabase
      .from('groups')
      .update({ status: status })
      .eq('id', groupId);
    if (updateError) throw updateError;

    // 2. Append to grades log
    if (gradeStr) {
      const { error: gradeError } = await supabase
        .from('grades')
        .insert({
          group_id: groupId,
          grader_id: graderId,
          grade_value: gradeStr
        });
      if (gradeError) throw gradeError;
    }

    // Trigger notification
    const { data: members } = await supabase.from('group_members').select('user_id').eq('group_id', groupId);
    if (members) {
      const notifications = members.map(m => ({
        user_id: m.user_id,
        message: `Status updated to ${status}${gradeStr ? ' with grade ' + gradeStr : ''}`,
        type: 'status',
        link: `/classes/default/group/${groupId}`
      }));
      if (notifications.length > 0) {
        await supabase.from('notifications').insert(notifications);
      }
    }
  }
};
