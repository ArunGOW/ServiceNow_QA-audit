const TokenService = {
  getAccessToken() {
    return localStorage.getItem("session_token");
  },

  getRefreshToken() {
    return localStorage.getItem("refresh_token");
  },

  setTokens(session_token, refresh_token) {
    localStorage.setItem("session_token", session_token);
    localStorage.setItem("refresh_token", refresh_token);
  },

  updateAccessToken(session_token) {
    localStorage.setItem("session_token", session_token);
  },

  clearTokens() {
    localStorage.removeItem("session_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
  },
};

export default TokenService;