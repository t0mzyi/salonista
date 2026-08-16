import { salonService } from '../services/salonService.js';

export const salonController = {
  async getSalons(req, res, next) {
    try {
      const salons = await salonService.getAllSalons();
      res.status(200).json({ success: true, data: salons });
    } catch (error) {
      next(error);
    }
  },

  async getSalon(req, res, next) {
    try {
      const salon = await salonService.getSalonById(req.params.id);
      res.status(200).json({ success: true, data: salon });
    } catch (error) {
      next(error);
    }
  },

  async createSalon(req, res, next) {
    try {
      const newSalon = await salonService.createSalon(req.body);
      res.status(201).json({ success: true, data: newSalon });
    } catch (error) {
      next(error);
    }
  },

  async updateSalon(req, res, next) {
    try {
      const updated = await salonService.updateSalon(req.params.id, req.body);
      res.status(200).json({ success: true, data: updated });
    } catch (error) {
      next(error);
    }
  },

  async deleteSalon(req, res, next) {
    try {
      const result = await salonService.deleteSalon(req.params.id);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }
};

