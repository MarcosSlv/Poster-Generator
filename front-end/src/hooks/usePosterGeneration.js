import { useCallback, useState } from "react";

import { getRequestErrorMessage } from "../services/requestError";

const FALLBACK_ERROR = "Erro ao criar cartaz. Por favor, tente novamente.";

const usePosterGeneration = () => {
  const [downloadUrl, setDownloadUrl] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [isSubmiting, setIsSubmiting] = useState(false);

  const clearResult = useCallback(() => {
    setDownloadUrl("");
    setSuccessMessage("");
    setSubmitError("");
  }, []);

  const generate = useCallback(async (request) => {
    clearResult();
    setIsSubmiting(true);

    try {
      const response = await request();

      if (response.status === "Success") {
        setDownloadUrl(response.download);
        setSuccessMessage(response.message);
      } else {
        setSubmitError(response.message || FALLBACK_ERROR);
      }
    } catch (error) {
      console.error("Erro ao criar cartaz:", error);
      setSubmitError(getRequestErrorMessage(error));
    } finally {
      setIsSubmiting(false);
    }
  }, [clearResult]);

  return { downloadUrl, successMessage, submitError, isSubmiting, generate, clearResult };
};

export default usePosterGeneration;
