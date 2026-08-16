import { supabase } from '../config/supabase.js';

/**
 * Upsert user by phone number and name
 */
export const upsertUser = async (phone, name) => {
  const { data, error } = await supabase
    .from('users')
    .upsert({ phone, name, updated_at: new Date().toISOString() }, { onConflict: 'phone' })
    .select()
    .single();

  if (error) throw error;
  return data;
};

/**
 * Get all users ordered by creation date
 */
export const getAllUsers = async () => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

/**
 * Update user block status
 */
export const updateUserBlockStatus = async (id, isBlocked) => {
  const { data, error } = await supabase
    .from('users')
    .update({ is_blocked: isBlocked, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};
