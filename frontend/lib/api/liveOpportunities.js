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

    // Add planning status filter
    if (filters.planningStatus?.length > 0) {
      params.set("planningStatus", filters.planningStatus.join(","));
    }

    // Add land purchase status filter
    if (filters.landPurchaseStatus?.length > 0) {
      params.set("landPurchaseStatus", filters.landPurchaseStatus.join(","));
    }

    // Add start date filter
    if (filters.startDate?.mode) {
      params.set("startDateMode", filters.startDate.mode);
      if (filters.startDate.mode === "between") {
        params.set("startDateStart", filters.startDate.startDate);
        params.set("startDateEnd", filters.startDate.endDate);
      } else {
        params.set("startDateSingle", filters.startDate.single);
      }
    }

    // Add first handover date filter
    if (filters.firstHandoverDate?.mode) {
      params.set("firstHandoverDateMode", filters.firstHandoverDate.mode);
      if (filters.firstHandoverDate.mode === "between") {
        params.set(
          "firstHandoverDateStart",
          filters.firstHandoverDate.startDate
        );
        params.set("firstHandoverDateEnd", filters.firstHandoverDate.endDate);
      } else {
        params.set("firstHandoverDateSingle", filters.firstHandoverDate.single);
      }
    }

    // Add final handover date filter
    if (filters.finalHandoverDate?.mode) {
      params.set("finalHandoverDateMode", filters.finalHandoverDate.mode);
      if (filters.finalHandoverDate.mode === "between") {
        params.set(
          "finalHandoverDateStart",
          filters.finalHandoverDate.startDate
        );
        params.set("finalHandoverDateEnd", filters.finalHandoverDate.endDate);
      } else {
        params.set("finalHandoverDateSingle", filters.finalHandoverDate.single);
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
