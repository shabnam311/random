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
    const { data, error } = await supabase
      .from('groups')
      .select('*, group_members(*, users(*))')
      .eq('project_id', classId); // Simplified relationship for example
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
    const filePath = `${groupId}/${Date.now()}_${file.name}`;
    const { data: storageData, error: storageError } = await supabase
      .storage
      .from('project_files')
      .upload(filePath, file);
      
    if (storageError) throw storageError;

    // 2. Insert into files & file_versions tables (mocked via RPC or direct insert depending on RLS)
    return storageData;
  }
};
