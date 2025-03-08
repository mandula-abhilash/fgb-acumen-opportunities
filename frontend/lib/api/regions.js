import api from "@/visdak-auth/src/api/axiosInstance";

export async function getRegions() {
  try {
    const response = await api.get("/api/regions");
    return response.data.data;
  } catch (error) {
    console.error("Error fetching regions:", error);
    throw new Error(error.response?.data?.message || "Failed to fetch regions");
  }
}
