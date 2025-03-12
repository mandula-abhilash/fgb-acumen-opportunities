export const removeAuthCookies = () => {
  if (typeof document === "undefined") return;

  const cookies = ["accessToken", "refreshToken"];
  const domains = [
    window.location.hostname,
    `.${window.location.hostname}`,
    window.location.hostname.split(".").slice(1).join("."),
    `.${window.location.hostname.split(".").slice(1).join(".")}`,
  ];

  cookies.forEach((cookie) => {
    domains.forEach((domain) => {
      document.cookie = `${cookie}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=${domain}`;
    });
    // Also try without domain
    document.cookie = `${cookie}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;`;
  });
};
