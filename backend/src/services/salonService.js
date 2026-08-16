import { salonModel } from '../models/salonModel.js';

/**
 * Resolves Google Maps shortlinks (e.g. maps.app.goo.gl/...) and extracts exact lat/lng coordinates
 */
async function resolveAndExtractMapCoords(mapUrl) {
  if (!mapUrl || typeof mapUrl !== 'string') return null;

  try {
    let targetUrl = mapUrl.trim();

    // If it's a shortlink, follow the redirect to get the full Google Maps destination URL
    if (targetUrl.includes('goo.gl') || targetUrl.includes('maps.app')) {
      const headRes = await fetch(targetUrl, { method: 'HEAD', redirect: 'follow' });
      if (headRes && headRes.url && headRes.url !== targetUrl) {
        targetUrl = headRes.url;
      }
    }

    // 1. Check search path coordinates (/maps/search/LAT,+LNG or /maps/search/LAT,LNG)
    const matchSearch = targetUrl.match(/\/maps\/search\/(-?\d+\.\d+)(?:,\+|\+|,|\s+)(-?\d+\.\d+)/);
    if (matchSearch) {
      return { lat: parseFloat(matchSearch[1]), lng: parseFloat(matchSearch[2]), expandedUrl: targetUrl };
    }

    // 2. Check data coordinates (!3dLAT!4dLNG)
    const matchData = targetUrl.match(/!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/);
    if (matchData) {
      return { lat: parseFloat(matchData[1]), lng: parseFloat(matchData[2]), expandedUrl: targetUrl };
    }

    // 3. Check path coordinates (@LAT,LNG)
    const matchAt = targetUrl.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
    if (matchAt) {
      return { lat: parseFloat(matchAt[1]), lng: parseFloat(matchAt[2]), expandedUrl: targetUrl };
    }

    // 4. Check query param coordinates (?q=LAT,LNG or ll=LAT,LNG)
    const matchQ = targetUrl.match(/[?&](?:q|ll|query|destination)=(-?\d+\.\d+)(?:,\+|\+|,|\s+)(-?\d+\.\d+)/);
    if (matchQ) {
      return { lat: parseFloat(matchQ[1]), lng: parseFloat(matchQ[2]), expandedUrl: targetUrl };
    }

    return { expandedUrl: targetUrl };
  } catch (err) {
    console.warn('Could not expand map URL redirect:', err.message);
    return null;
  }
}

export const salonService = {
  async getAllSalons() {
    const salons = await salonModel.getAllSalons();
    // Expand any shortlinks on the fly if needed
    for (const s of salons || []) {
      if (s.map_url && (s.map_url.includes('maps.app') || s.map_url.includes('goo.gl'))) {
        const resolved = await resolveAndExtractMapCoords(s.map_url);
        if (resolved && resolved.expandedUrl) {
          s.map_url = resolved.expandedUrl;
        }
      }
    }
    return salons;
  },

  async getSalonById(id) {
    if (!id) throw new Error("Salon ID is required");
    const salon = await salonModel.getSalonById(id);
    if (salon && salon.map_url && (salon.map_url.includes('maps.app') || salon.map_url.includes('goo.gl'))) {
      const resolved = await resolveAndExtractMapCoords(salon.map_url);
      if (resolved && resolved.expandedUrl) {
        salon.map_url = resolved.expandedUrl;
      }
    }
    return salon;
  },

  async createSalon(data) {
    if (!data.owner_phone) {
      throw new Error("Authentication required: Please verify your phone number to register a salon.");
    }
    if (!data.name || !data.location) {
      throw new Error("Salon name and location are required");
    }

    // Automatically resolve exact coordinates and expanded URL if map_url was provided
    if (data.map_url) {
      const resolved = await resolveAndExtractMapCoords(data.map_url);
      if (resolved && resolved.expandedUrl) {
        data.map_url = resolved.expandedUrl;
      }
    }

    // Generate unique URL slug from salon name
    const baseSlug = (data.name || 'salon')
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'salon';

    let uniqueSlug = baseSlug;
    let counter = 1;
    while (true) {
      const existing = await salonModel.getSalonBySlug(uniqueSlug);
      if (!existing) break;
      counter++;
      uniqueSlug = `${baseSlug}-${counter}`;
    }
    data.slug = uniqueSlug;

    // Set default schedule (Tuesdays closed by default in Kerala barber tradition)
    if (!data.schedule) {
      data.schedule = {
        openDays: ['Mon', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        openTime: '09:00',
        closeTime: '21:00'
      };
    }

    // Set 7-day trial period by default
    if (!data.subscription_status) {
      data.subscription_status = 'trial';
    }
    if (!data.trial_ends_at) {
      const sevenDaysLater = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
      data.trial_ends_at = sevenDaysLater.toISOString();
    }

    // Validate services payload if provided
    if (data.services && Array.isArray(data.services)) {
      data.services = data.services.map(s => {
        const priceNum = Math.abs(parseInt(String(s.price).replace(/[^0-9]/g, ''), 10));
        const durationNum = Math.abs(parseInt(String(s.durationMinutes).replace(/[^0-9]/g, ''), 10));
        if (isNaN(priceNum) || priceNum <= 0) {
          throw new Error(`Service "${s.name || 'unnamed'}" must have a valid positive price without hyphens or negative signs`);
        }
        if (isNaN(durationNum) || durationNum <= 0) {
          throw new Error(`Service "${s.name || 'unnamed'}" must have a valid positive duration in minutes`);
        }
        return {
          ...s,
          price: priceNum,
          durationMinutes: durationNum
        };
      });
    }

    return await salonModel.createSalon(data);
  },

  async updateSalon(id, updateData) {
    if (!id) throw new Error("Salon ID is required");

    if (updateData.map_url) {
      const resolved = await resolveAndExtractMapCoords(updateData.map_url);
      if (resolved && resolved.expandedUrl) {
        updateData.map_url = resolved.expandedUrl;
      }
    }

    // Validate services payload on update
    if (updateData.services && Array.isArray(updateData.services)) {
      updateData.services = updateData.services.map(s => {
        const priceNum = Math.abs(parseInt(String(s.price).replace(/[^0-9]/g, ''), 10));
        const durationNum = Math.abs(parseInt(String(s.durationMinutes).replace(/[^0-9]/g, ''), 10));
        if (isNaN(priceNum) || priceNum <= 0) {
          throw new Error(`Service "${s.name || 'unnamed'}" must have a valid positive price without hyphens or negative signs`);
        }
        if (isNaN(durationNum) || durationNum <= 0) {
          throw new Error(`Service "${s.name || 'unnamed'}" must have a valid positive duration in minutes`);
        }
        return {
          ...s,
          price: priceNum,
          durationMinutes: durationNum
        };
      });
    }

    return await salonModel.updateSalon(id, updateData);
  },

  async deleteSalon(id) {
    if (!id) throw new Error('Salon ID is required');
    return await salonModel.deleteSalon(id);
  }
};


