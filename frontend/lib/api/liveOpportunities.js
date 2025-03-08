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

export async function getLiveOpportunitySites() {
  try {
    const response = await api.get("/api/live-opportunities");
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
