import api from "@api";

const login = (payload) => {
  return api.post("/auth/login", payload);
};

const logout = () => {
  return api.post("/auth/logout");
};

export { login, logout };

