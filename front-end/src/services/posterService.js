import api from "./api";

export const posterService = {
  generateSmallPoster: async (data) => {
    const response = await api.post('/posters/small', data);
    return response.data;
  },

  generateBigPoster: async (data) => {
    const response = await api.post('/posters/big', data);
    return response.data;
  },
  generateComboPoster: async (data) => {
    const response = await api.post('/posters/combo', data);
    return response.data;
  }
};