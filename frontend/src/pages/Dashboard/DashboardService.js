import api from "@api";

const createUrlService = (payload) => {
  return api.post("/", payload);
};

const getOriginalUrlService = (payload) => {
  return api.post("/get-original-url", payload);
};

const getUrlHistoryService = (payload) => {
  return api.post("/url-history", payload);
};

const deleteUrlHistoryService = (id) => {
  return api.delete(`/delete-history/${id}`);
};

export {
  createUrlService,
  deleteUrlHistoryService,
  getOriginalUrlService,
  getUrlHistoryService
};

