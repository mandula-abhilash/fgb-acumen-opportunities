import api from "@/visdak-auth/src/api/axiosInstance";

export async function createCheckoutSession() {
  try {
    const response = await api.post("/api/checkout/session", {
      price: 25000, // £250.00 in pence
      quantity: 1,
      successUrl: `${window.location.origin}/success`,
      cancelUrl: `${window.location.origin}/cancel`,
      metadata: {
        service: "assisted-site-submission",
      },
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
