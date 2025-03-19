import api from "@/visdak-auth/src/api/axiosInstance";

export async function createLiveOpportunitySite(siteData) {
  try {
    const response = await api.post("/api/live-opportunities", siteData);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to create opportunity"
    );
  }
}

export async function getLiveOpportunitySites(filters = {}) {
  try {
    // Build query parameters
    const params = new URLSearchParams();

    if (filters.regions?.length > 0) {
      params.set("regions", filters.regions.join(","));
    }

    // Add plots filter
    if (filters.plots?.mode) {
      params.set("plotsMode", filters.plots.mode);
      if (filters.plots.mode === "between") {
        params.set("plotsMin", filters.plots.min);
        params.set("plotsMax", filters.plots.max);
      } else {
        params.set("plotsValue", filters.plots.single);
      }
    }

    const url = `/api/live-opportunities${params.toString() ? `?${params.toString()}` : ""}`;
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch opportunities"
    );
  }
}

export async function getLiveOpportunitySite(id) {
  try {
    const response = await api.get(`/api/live-opportunities/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch opportunity"
    );
  }
}

export async function updateLiveOpportunitySite(id, siteData) {
  try {
    const response = await api.put(`/api/live-opportunities/${id}`, siteData);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to update opportunity"
    );
  }
}

export async function deleteLiveOpportunitySite(id) {
  try {
    const response = await api.delete(`/api/live-opportunities/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to delete opportunity"
    );
  }
}
