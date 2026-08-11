const DEFAULT_MESSAGE = "Erro ao criar cartaz. Por favor, tente novamente.";

export const getRequestErrorMessage = (error, fallback = DEFAULT_MESSAGE) => {
  if (error?.code === "ECONNABORTED") {
    return "O servidor demorou demais para responder. Tente novamente em alguns instantes.";
  }

  if (error?.response?.data?.message) {
    return error.response.data.message;
  }

  if (error?.response) {
    return fallback;
  }

  if (error?.request) {
    return "Não foi possível falar com o servidor. Verifique sua conexão e tente novamente.";
  }

  return fallback;
};
