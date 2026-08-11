import { useEffect, useState } from "react";

import { MESSAGES, SHEET_LAYOUTS, parseSheet } from "../services/sheetParser";

const useSheetReader = (fileList, layoutName) => {
  const [dataArray, setDataArray] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const file = fileList && fileList.length > 0 ? fileList[0] : null;

  useEffect(() => {
    if (!file) {
      setDataArray([]);
      setError(null);
      setLoading(false);
      return;
    }

    let cancelled = false;

    setLoading(true);
    setError(null);
    setDataArray([]);

    const reader = new FileReader();

    reader.onload = (event) => {
      if (cancelled) {
        return;
      }

      const { rows, error: parseError } = parseSheet(event.target.result, SHEET_LAYOUTS[layoutName]);

      setDataArray(rows);
      setError(parseError);
      setLoading(false);
    };

    reader.onerror = () => {
      if (cancelled) {
        return;
      }

      setError(MESSAGES.unreadable);
      setLoading(false);
    };

    reader.readAsArrayBuffer(file);

    return () => {
      cancelled = true;
      reader.abort();
    };
  }, [file, layoutName]);

  return { dataArray, loading, error };
};

export default useSheetReader;
