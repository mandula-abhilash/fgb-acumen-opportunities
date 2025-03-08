import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getRegions() {
  try {
    const response = await axios.get(`${API_URL}/api/regions`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching regions:", error);
    throw new Error(error.response?.data?.message || "Failed to fetch regions");
  }
}
