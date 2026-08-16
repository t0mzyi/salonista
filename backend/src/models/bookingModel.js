import { supabase } from '../config/supabase.js';

export const bookingModel = {
  async getAllBookings(filters = {}) {
    let query = supabase.from('bookings').select('*').order('start_time', { ascending: true });
    
    if (filters.salonId) {
      query = query.eq('salon_id', filters.salonId);
    }
    if (filters.customerPhone) {
      query = query.eq('customer_phone', filters.customerPhone);
    }
    if (filters.status) {
      query = query.eq('status', filters.status);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  async getBookingById(id) {
    const { data, error } = await supabase.from('bookings').select('*').eq('id', id).single();
    if (error) throw error;
    return data;
  },

  async createBooking(bookingData) {
    const { data, error } = await supabase.from('bookings').insert([bookingData]).select().single();
    if (error) throw error;
    return data;
  },

  async updateBooking(id, updateData) {
    const { data, error } = await supabase.from('bookings').update(updateData).eq('id', id).select().single();
    if (error) throw error;
    return data;
  },

  async deleteBooking(id) {
    const { data, error } = await supabase.from('bookings').delete().eq('id', id);
    if (error) throw error;
    return { success: true };
  }
};
