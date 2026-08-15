import { supabase } from '../config/supabase.js';

export const salonModel = {
  async getAllSalons() {
    const { data, error } = await supabase.from('salons').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  async getSalonById(id) {
    const { data, error } = await supabase.from('salons').select('*').eq('id', id).single();
    if (error) throw error;
    return data;
  },

  async createSalon(salonData) {
    const { data, error } = await supabase.from('salons').insert([salonData]).select().single();
    if (error) throw error;
    return data;
  },

  async updateSalon(id, updateData) {
    const { data, error } = await supabase.from('salons').update(updateData).eq('id', id).select();
    if (error) throw error;
    return (data && data.length > 0) ? data[0] : { id, ...updateData };
  }
};


