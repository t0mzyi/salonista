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

    return await salonModel.updateSalon(id, updateData);
  }
};


