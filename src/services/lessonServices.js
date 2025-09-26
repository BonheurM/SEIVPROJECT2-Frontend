import apiClient from "./services.js";

export default {
  getAllLessons(tutorialId) {
    return apiClient.get(`/tutorial-simple/tutorials/${tutorialId}/lessons`);
  },
  getLesson(tutorialId, id) {
    return apiClient.get(`/tutorial-simple/tutorials/${tutorialId}/lessons/${id}`);
  },
  createLesson(tutorialId, data) {
    return apiClient.post(`/tutorial-simple/tutorials/${tutorialId}/lessons`, data);
  },
  updateLesson(tutorialId, id, data) {
    return apiClient.put(`/tutorial-simple/tutorials/${tutorialId}/lessons/${id}`, data);
  },
  deleteLesson(tutorialId, id) {
    return apiClient.delete(`/tutorial-simple/tutorials/${tutorialId}/lessons/${id}`);
  },
};
