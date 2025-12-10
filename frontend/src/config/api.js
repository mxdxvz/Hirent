// =============================================
// FRONTEND API CONFIGURATION (FULLY FIXED)
// =============================================

// Base API URL
export const API_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5000";

// IMPORTANT — all endpoints must start with /api
const API_PREFIX = "/api";

// =============================================
// CENTRALIZED ENDPOINTS
// =============================================
export const ENDPOINTS = {
  // -----------------------
  // AUTHENTICATION
  // -----------------------
  AUTH: {
    REGISTER: `${API_PREFIX}/auth/register`,
    LOGIN: `${API_PREFIX}/auth/login`,
    GOOGLE: `${API_PREFIX}/auth/google`,
    GOOGLE_CALLBACK: `${API_PREFIX}/auth/google/callback`,
    PROFILE: `${API_PREFIX}/auth/profile`,
  },

  // -----------------------
  // ITEMS
  // -----------------------
  ITEMS: {
    GET_ALL: `${API_PREFIX}/items`,
    GET_ONE: (id) => `${API_PREFIX}/items/${id}`,
    SEARCH: `${API_PREFIX}/items/search`,
    FEATURED: `${API_PREFIX}/items/featured`,
    BY_OWNER: (ownerId) => `${API_PREFIX}/items/owner/${ownerId}`,
    CREATE: `${API_PREFIX}/items`,
    UPDATE: (id) => `${API_PREFIX}/items/${id}`,
    DELETE: (id) => `${API_PREFIX}/items/${id}`,
  },

  // -----------------------
  // HOMEPAGE
  // -----------------------
  HOMEPAGE: {
    FEATURED_CATEGORIES: `${API_PREFIX}/homepage/categories/featured`,
    CATEGORY_ITEMS: (slug) =>
      `${API_PREFIX}/homepage/categories/${slug}/items`,
    FEATURED_ITEMS: `${API_PREFIX}/homepage/items/featured`,
    SEARCH: `${API_PREFIX}/homepage/search`,
    PERSONALIZED: `${API_PREFIX}/homepage/personalized`,
  },

  // -----------------------
  // CART
  // -----------------------
  CART: {
    GET: `${API_PREFIX}/cart`,
    ADD: `${API_PREFIX}/cart/add`,
    REMOVE: (itemId) => `${API_PREFIX}/cart/remove/${itemId}`,
    UPDATE: `${API_PREFIX}/cart/update`,
  },

  // -----------------------
  // WISHLIST
  // -----------------------
  WISHLIST: {
    GET: `${API_PREFIX}/wishlist`,
    ADD: `${API_PREFIX}/wishlist`,
    REMOVE: (itemId) => `${API_PREFIX}/wishlist/${itemId}`,
  },

  // -----------------------
  // BOOKINGS
  // -----------------------
  BOOKINGS: {
    GET_MY: `${API_PREFIX}/bookings/me`,
    CREATE: `${API_PREFIX}/bookings`,
    GET_ONE: (id) => `${API_PREFIX}/bookings/${id}`,
    CANCEL: (id) => `${API_PREFIX}/bookings/${id}/cancel`,
    UPDATE_STATUS: (id) => `${API_PREFIX}/bookings/${id}/status`,
    OWNER_BOOKINGS: `${API_PREFIX}/bookings/owner`,
  },

  // -----------------------
  // RETURNS
  // -----------------------
  RETURNS: {
    GET_ALL: `${API_PREFIX}/returns`,
    GET_ONE: (id) => `${API_PREFIX}/returns/${id}`,
    CREATE: `${API_PREFIX}/returns`,
    UPDATE: (id) => `${API_PREFIX}/returns/${id}`,
  },

  // -----------------------
  // EARNINGS
  // -----------------------
  EARNINGS: {
    GET_ALL: `${API_PREFIX}/earnings`,
    GET_SUMMARY: `${API_PREFIX}/earnings/summary`,
  },

  // -----------------------
  // MESSAGES
  // -----------------------
  MESSAGES: {
    GET_ALL: `${API_PREFIX}/messages`,
    SEND: `${API_PREFIX}/messages/send`,
    BLOCK: (chatId) => `${API_PREFIX}/messages/${chatId}/block`,
  },

  // -----------------------
  // USERS
  // -----------------------
  USERS: {
    GET_ALL: `${API_PREFIX}/users`,
    CREATE: `${API_PREFIX}/users`,
    GET_PROFILE: `${API_PREFIX}/users/profile`,
    UPDATE_PROFILE: `${API_PREFIX}/users/profile`,
  },

  // -----------------------
  // LOCATIONS
  // -----------------------
  LOCATIONS: {
    ADD: `${API_PREFIX}/locations`,
    NEARBY: `${API_PREFIX}/locations/nearby`,
  },

  // -----------------------
  // NOTIFICATIONS
  // -----------------------
  NOTIFICATIONS: {
    GET_ALL: `${API_PREFIX}/notifications`,
    READ: (id) => `${API_PREFIX}/notifications/${id}/read`,
    READ_ALL: `${API_PREFIX}/notifications/read-all`,
    CLEAR_ALL: `${API_PREFIX}/notifications/clear-all`,
  },
};

// =============================================
// SAFE API CALL WRAPPER
// =============================================
export const makeAPICall = async (endpoint, options = {}) => {
  const token = localStorage.getItem("token");

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  // Don't override Content-Type if FormData is being sent
  if (options.body instanceof FormData) {
    delete headers["Content-Type"];
  }

  // Inject Bearer token if available
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    // Prevent undefined JSON errors
    const data = await response.json().catch(() => null);

    // Handle 401 Unauthorized - only redirect if not a profile update
    if (!response.ok && response.status === 401) {
      // Don't logout on profile update 401 - it might be a validation error
      if (endpoint !== ENDPOINTS.AUTH.PROFILE) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
      }
      return data ?? null;
    }

    return data ?? null;
  } catch (error) {
    console.error("API call failed:", error);
    throw error;
  }
};

export default API_URL;