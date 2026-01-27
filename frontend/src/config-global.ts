export const HOST_API =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";
export const HOST_SOCKET =
  process.env.NEXT_PUBLIC_WS_URL ?? "http://localhost:5000";

  
export const DEFAULT_ERROR_MESSAGE =
  "An unexpected error occurred. Please try again.";

export const HOST_API_BASE = HOST_API.replace(/\/api$/, "");

export const ECOMMERCE_VARIABLES = {
  freeShippingWhenSubtotalExceeds: 200000,
  includesTax: false,
  taxRate: 0.08, // 8%
};

export const CONFIG = {
  site: {
    name: "Ecommerce2",
    description: "Ecommerce2 Application",
    keywords: "Ecommerce2, Application",
    logo: "/assets/logo/logo.png",
    favicon: "/assets/logo/favicon.ico",
    basePath: "",
  },
};
