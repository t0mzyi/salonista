import { supabase } from '../config/supabase.js';

export const salonModel = {
  async getAllSalons() {
    const { data, error } = await supabase.from('salons').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  async getSalonById(idOrSlug) {
    // Try by UUID / ID first
    let query = supabase.from('salons').select('*');
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idOrSlug);
    if (isUuid) {
      query = query.eq('id', idOrSlug);
    } else {
      query = query.eq('slug', idOrSlug);
    }
    const { data, error } = await query.maybeSingle();
    if (error) throw error;
    if (!data && isUuid) {
      // Try slug as fallback
      const { data: slugData, error: slugErr } = await supabase.from('salons').select('*').eq('slug', idOrSlug).maybeSingle();
      if (slugErr) throw slugErr;
      return slugData;
    }
    return data;
  },

  async getSalonBySlug(slug) {
    const { data, error } = await supabase.from('salons').select('*').eq('slug', slug).maybeSingle();
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
  },

  async deleteSalon(id) {
    const { error } = await supabase.from('salons').delete().eq('id', id);
    if (error) throw error;
    return { success: true, id };
  }
};


