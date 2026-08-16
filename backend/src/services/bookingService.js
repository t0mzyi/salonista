import { bookingModel } from '../models/bookingModel.js';
import { salonModel } from '../models/salonModel.js';

export const bookingService = {
  async getBookings(filters) {
    return await bookingModel.getAllBookings(filters);
  },

  async getBookingById(id) {
    return await bookingModel.getBookingById(id);
  },

  async createBooking(bookingData) {
    const { salon_id, customer_name, customer_phone, service_ids, start_time, stylist_id, is_app_booking, total_price, total_duration_minutes } = bookingData;

    if (!salon_id) {
      throw new Error('Salon ID is required');
    }
    if (!customer_name || !customer_name.trim()) {
      throw new Error('Customer name is required');
    }
    if (!start_time) {
      throw new Error('Booking start time is required');
    }

    // Verify salon is not closed
    const salon = await salonModel.getSalonById(salon_id);
    if (salon && salon.is_closed) {
      throw new Error('This salon is currently closed and not accepting bookings today');
    }

    const duration = Number(total_duration_minutes) || 30;
    const start = new Date(start_time);
    const end = new Date(start.getTime() + duration * 60000);

    const payload = {
      salon_id,
      customer_name: customer_name.trim(),
      customer_phone: customer_phone ? customer_phone.trim() : '',
      service_ids: Array.isArray(service_ids) ? service_ids : [],
      stylist_id: stylist_id || null,
      start_time: start.toISOString(),
      end_time: end.toISOString(),
      status: 'booked',
      is_app_booking: is_app_booking !== undefined ? Boolean(is_app_booking) : true,
      total_price: Number(total_price) || 0,
      total_duration_minutes: duration
    };

    return await bookingModel.createBooking(payload);
  },

  async updateBookingStatus(id, status) {
    const validStatuses = ['booked', 'in_progress', 'completed', 'cancelled', 'no_show'];
    if (!validStatuses.includes(status)) {
      throw new Error(`Invalid status. Must be one of: ${validStatuses.join(', ')}`);
    }
    return await bookingModel.updateBooking(id, { status });
  },

  async updateBooking(id, updateData) {
    return await bookingModel.updateBooking(id, updateData);
  },

  async deleteBooking(id) {
    return await bookingModel.deleteBooking(id);
  }
};
