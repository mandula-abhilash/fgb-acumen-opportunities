import api from "@/visdak-auth/src/api/axiosInstance";

export async function createCheckoutSession() {
  try {
    const response = await api.post("/api/checkout/session", {
      planId: "674de95d1948d7d51a9c16a7",
      paymentGateway: "stripe",
      quantity: 1,
    });
    return response.data;
  } catch (error) {
    console.error("Error creating checkout session:", error);
    throw new Error(
      error.response?.data?.message || "Failed to create checkout session"
    );
  }
}

export async function verifyPaymentSession(sessionId) {
  try {
    const response = await api.get(`/api/checkout/verify/${sessionId}`);
    return response.data;
  } catch (error) {
    console.error("Error verifying payment session:", error);
    throw new Error(
      error.response?.data?.message || "Failed to verify payment session"
    );
  }
}
