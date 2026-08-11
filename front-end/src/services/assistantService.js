import api from "./api";

export const assistantService = {
  formatSheet: async (texto) => {
    const response = await api.post('/assistant/format', { texto });
    return response.data;
  }
};
