import { useState, useEffect } from "react";
import * as XLSX from 'xlsx';

const formatCurrency = (value) => {
  if (value === null || value === undefined || value === '') {
    return '';
  }

  const numValue = typeof value === 'number' ? value : parseFloat(String(value).replace(',', '.'));

  if (isNaN(numValue)) {
    return String(value);
  }

  return numValue.toFixed(2).replace('.', ',');
};

export const sheetReaderService = {
  standardPoster: (sheet) => {
    const [dataArray, setDataArray] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const expectedHeaders = ["produto", "medida", "preco"];

    useEffect(() => {
      if (!sheet || sheet.length === 0) {
        setError(null);
        setDataArray([]);
        setLoading(false);
        return;
      }

      if (sheet && sheet.length > 0) {
        setLoading(true);
        setError(null);
        setDataArray([]);

        const file = sheet[0];
        const reader = new FileReader();

        reader.onload = (e) => {
          try {
            const arrayBuffer = e.target.result;
            const workbook = XLSX.read(arrayBuffer, { type: 'array' });

            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];

            const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

            if (!jsonData || jsonData.length === 0 || !jsonData[0]) {
              setError('Cabeçalhos da planilha incorretos.');
              setDataArray([]);
              setLoading(false);
              return;
            }

            const headers = jsonData[0]
              .filter(header => header !== undefined && header !== null && header !== '')
              .map(header => String(header).trim().toLowerCase());

            const PosterHeaders = expectedHeaders.every(header => headers.includes(header));

            if (!PosterHeaders) {
              setError('Cabeçalhos da planilha incorretos.');
              setDataArray([]);
              setLoading(false);
              return;
            }

            const dataObjects = [];
            const invalidRows = [];

            jsonData.slice(1).forEach((row, rowIndex) => {
              if (!row.some(cell => cell !== null && cell !== undefined && cell !== '')) {
                return;
              }

              const obj = {};
              let hasAllRequiredFields = true;

              headers.forEach((header, index) => {
                let cellValue = row[index] ?? "";

                if (header === 'preco') {
                  cellValue = formatCurrency(cellValue);
                } else {
                  cellValue = cellValue;
                }

                obj[header] = cellValue;
              });

              if (!obj.produto || obj.produto.toString().trim() === '') {
                return;
              }

              expectedHeaders.forEach(header => {
                if (!obj[header] || obj[header].toString().trim() === '') {
                  hasAllRequiredFields = false;
                  invalidRows.push({
                    line: rowIndex + 2,
                    missingField: header,
                    data: obj
                  });
                }
              });

              if (hasAllRequiredFields) {
                dataObjects.push(obj);
              }
            });

            if (invalidRows.length > 0) {
              setError('Planilha incompleta! Verifique se todas as colunas estão preenchidas corretamente.');
              setDataArray([]);
            } else if (dataObjects.length === 0) {
              setError('Nenhuma linha válida foi encontrada na planilha.');
              setDataArray([]);
            } else {
              setDataArray(dataObjects);
            }
          } catch (err) {
            setError('Erro ao ler o arquivo. Certifique-se de que está tudo correto na planilha.');
          } finally {
            setLoading(false);
          }
        };

        reader.readAsArrayBuffer(file);
      }
    }, [sheet]);

    return { dataArray, loading, error };
  },

  comboPoster: (sheet) => {
    const [dataArray, setDataArray] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const expectedHeaders = ["produto", "medida", "combovlr", "comboqtd"];

    useEffect(() => {
      if (!sheet || sheet.length === 0) {
        setError(null);
        setDataArray([]);
        setLoading(false);
        return;
      }

      if (sheet && sheet.length > 0) {
        setLoading(true);
        setError(null);
        setDataArray([]);

        const file = sheet[0];
        const reader = new FileReader();

        reader.onload = (e) => {
          try {
            const arrayBuffer = e.target.result;
            const workbook = XLSX.read(arrayBuffer, { type: 'array' });

            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];

            const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

            if (!jsonData || jsonData.length === 0 || !jsonData[0]) {
              setError('Cabeçalhos da planilha incorretos.');
              setDataArray([]);
              setLoading(false);
              return;
            }

            const headers = jsonData[0]
              .filter(header => header !== undefined && header !== null && header !== '')
              .map(header => String(header).trim().toLowerCase());

            const PosterHeaders = expectedHeaders.every(header => headers.includes(header));

            if (!PosterHeaders) {
              setError('Cabeçalhos da planilha incorretos.');
              setDataArray([]);
              setLoading(false);
              return;
            }

            const dataObjects = [];
            const invalidRows = [];

            jsonData.slice(1).forEach((row, rowIndex) => {
              if (!row.some(cell => cell !== null && cell !== undefined && cell !== '')) {
                return;
              }

              const obj = {};
              let hasAllRequiredFields = true;

              headers.forEach((header, index) => {
                let cellValue = row[index] ?? "";

                if (header === 'combovlr') {
                  cellValue = formatCurrency(cellValue);
                } else {
                  cellValue = cellValue;
                }

                obj[header] = cellValue;
              });

              if (!obj.produto || obj.produto.toString().trim() === '') {
                return;
              }

              expectedHeaders.forEach(header => {
                if (!obj[header] || obj[header].toString().trim() === '') {
                  hasAllRequiredFields = false;
                  invalidRows.push({
                    line: rowIndex + 2,
                    missingField: header,
                    data: obj
                  });
                }
              });

              if (hasAllRequiredFields) {
                const finalObj = {};
                headers.forEach((header, index) => {
                  const headerName = header === 'combovlr' ? 'comboVlr' :
                    header === 'comboqtd' ? 'comboQtd' : header;
                  finalObj[headerName] = obj[header];
                });
                dataObjects.push(finalObj);
              }
            });

            if (invalidRows.length > 0) {
              setError('Planilha incompleta! Verifique se todas as colunas obrigatórias estão preenchidas.');
              setDataArray([]);
            } else if (dataObjects.length === 0) {
              setError('Nenhuma linha válida foi encontrada na planilha.');
              setDataArray([]);
            } else {
              setDataArray(dataObjects);
            }
          } catch (err) {
            setError('Erro ao ler o arquivo. Certifique-se de que está tudo correto na planilha.');
          } finally {
            setLoading(false);
          }
        };

        reader.readAsArrayBuffer(file);
      }
    }, [sheet]);

    return { dataArray, loading, error };
  }
};
