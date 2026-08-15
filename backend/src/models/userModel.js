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
 * Find user by phone number
 */
export const getUserByPhone = async (phone) => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('phone', phone)
    .maybeSingle();

  if (error) throw error;
  return data;
};
