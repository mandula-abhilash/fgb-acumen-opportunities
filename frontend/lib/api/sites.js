import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function createSite(siteData) {
  try {
    const response = await axios.post(`${API_URL}/api/sites`, siteData, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to create site");
  }
}

export async function getSites() {
  try {
    const response = await axios.get(`${API_URL}/api/sites`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch sites");
  }
}

export async function getSite(id) {
  try {
    const response = await axios.get(`${API_URL}/api/sites/${id}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch site");
  }
}

export async function updateSite(id, siteData) {
  try {
    const response = await axios.put(`${API_URL}/api/sites/${id}`, siteData, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to update site");
  }
}

export async function deleteSite(id) {
  try {
    const response = await axios.delete(`${API_URL}/api/sites/${id}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to delete site");
  }
}
