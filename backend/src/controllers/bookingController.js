import { bookingService } from '../services/bookingService.js';

export const bookingController = {
  async getBookings(req, res, next) {
    try {
      const { salonId, customerPhone, status } = req.query;
      const data = await bookingService.getBookings({ salonId, customerPhone, status });
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  },

  async getBookingById(req, res, next) {
    try {
      const { id } = req.params;
      const data = await bookingService.getBookingById(id);
      if (!data) return res.status(404).json({ success: false, error: 'Booking not found' });
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  },

  async createBooking(req, res, next) {
    try {
      const data = await bookingService.createBooking(req.body);
      res.status(201).json({ success: true, data });
    } catch (err) {
      next(err);
    }
  },

  async updateBookingStatus(req, res, next) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const data = await bookingService.updateBookingStatus(id, status);
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  },

  async updateBooking(req, res, next) {
    try {
      const { id } = req.params;
      const data = await bookingService.updateBooking(id, req.body);
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  },

  async deleteBooking(req, res, next) {
    try {
      const { id } = req.params;
      await bookingService.deleteBooking(id);
      res.json({ success: true, message: 'Booking cancelled/deleted successfully' });
    } catch (err) {
      next(err);
    }
  }
};
