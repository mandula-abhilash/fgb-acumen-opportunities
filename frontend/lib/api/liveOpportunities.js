import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function createLiveOpportunitySite(siteData) {
  try {
    const response = await axios.post(
      `${API_URL}/api/live-opportunities`,
      siteData,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to create opportunity"
    );
  }
}

export async function getLiveOpportunitySites() {
  try {
    const response = await axios.get(`${API_URL}/api/live-opportunities`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch opportunities"
    );
  }
}

export async function getLiveOpportunitySite(id) {
  try {
    const response = await axios.get(
      `${API_URL}/api/live-opportunities/${id}`,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch opportunity"
    );
  }
}

export async function updateLiveOpportunitySite(id, siteData) {
  try {
    const response = await axios.put(
      `${API_URL}/api/live-opportunities/${id}`,
      siteData,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to update opportunity"
    );
  }
}

export async function deleteLiveOpportunitySite(id) {
  try {
    const response = await axios.delete(
      `${API_URL}/api/live-opportunities/${id}`,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to delete opportunity"
    );
  }
}
