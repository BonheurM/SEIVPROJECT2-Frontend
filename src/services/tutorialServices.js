import apiClient from "./services.js";

export default {
  getAll() {
    return apiClient.get("/tutorial-simple/tutorials");
  },
  getAllForUser(userId) {
    return apiClient.get("/tutorial-simple/tutorials/userTut/" + userId);
  },
  get(id) {
    return apiClient.get(`/tutorial-simple/tutorials/${id}`);
  },
  create(data) {
    return apiClient.post("/tutorial-simple/tutorials", data);
  },
  update(id, data) {
    return apiClient.put(`/tutorial-simple/tutorials/${id}`, data);
  },
  delete(id) {
    return apiClient.delete(`/tutorial-simple/tutorials/${id}`);
  },
  deleteAll() {
    return apiClient.delete(`/tutorial-simple/tutorials`);
  },
  findByTitle(title) {
    return apiClient.get(`/tutorial-simple/tutorials?title=${title}`);
  },
};
