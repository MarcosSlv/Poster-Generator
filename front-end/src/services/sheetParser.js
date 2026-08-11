import XLSX from 'xlsx-js-style';

export const SHEET_LAYOUTS = {
  standard: {
    requiredHeaders: ["produto", "medida", "preco"],
    currencyHeaders: ["preco"],
    headerAliases: {},
    columns: ["produto", "medida", "preco", "limite"],
    columnLabels: ["Produto", "Medida", "Preco", "Limite"]
  },
  combo: {
    requiredHeaders: ["produto", "medida", "combovlr", "comboqtd"],
    currencyHeaders: ["combovlr"],
    headerAliases: { combovlr: "comboVlr", comboqtd: "comboQtd" },
    columns: ["produto", "medida", "comboVlr", "comboQtd"],
    columnLabels: ["Produto", "Medida", "Combovlr", "Comboqtd"]
  }
};

export const rowsToTsv = (rows, columns) =>
  rows
    .map((row) => columns.map((column) => String(row[column] ?? '')).join('\t'))
    .join('\n');

export const MESSAGES = {
  invalidHeaders: "Cabeçalhos da planilha incorretos.",
  noValidRows: "Nenhuma linha válida foi encontrada na planilha.",
  unreadable: "Erro ao ler o arquivo. Certifique-se de que está tudo correto na planilha."
};

export const formatCurrency = (value) => {
  if (value === null || value === undefined || value === '') {
    return '';
  }

  const numValue = typeof value === 'number' ? value : parseFloat(String(value).replace(',', '.'));

  if (isNaN(numValue)) {
    return String(value);
  }

  return numValue.toFixed(2).replace('.', ',');
};

const isEmpty = (value) =>
  value === null || value === undefined || String(value).trim() === '';

const readHeaders = (headerRow) =>
  headerRow
    .map((name, column) => ({ name: String(name ?? '').trim().toLowerCase(), column }))
    .filter((header) => header.name !== '');

const describeMissingFields = (invalidRows) => {
  const preview = invalidRows
    .slice(0, 3)
    .map(({ line, missingFields }) => `linha ${line} (${missingFields.join(', ')})`)
    .join('; ');

  const remaining = invalidRows.length - 3;
  const suffix = remaining > 0 ? ` e mais ${remaining}` : '';

  return `Planilha incompleta: confira ${preview}${suffix}.`;
};

export const parseSheet = (arrayBuffer, layout) => {
  const { requiredHeaders, currencyHeaders, headerAliases } = layout;

  let jsonData;

  try {
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
  } catch {
    return { rows: [], error: MESSAGES.unreadable };
  }

  if (!jsonData || jsonData.length === 0 || !jsonData[0]) {
    return { rows: [], error: MESSAGES.invalidHeaders };
  }

  const headers = readHeaders(jsonData[0]);
  const headerNames = headers.map((header) => header.name);

  if (!requiredHeaders.every((header) => headerNames.includes(header))) {
    return { rows: [], error: MESSAGES.invalidHeaders };
  }

  const rows = [];
  const invalidRows = [];

  jsonData.slice(1).forEach((row, rowIndex) => {
    if (!row.some((cell) => !isEmpty(cell))) {
      return;
    }

    const parsed = {};

    headers.forEach(({ name, column }) => {
      const cell = row[column] ?? "";
      parsed[name] = currencyHeaders.includes(name) ? formatCurrency(cell) : cell;
    });

    if (isEmpty(parsed.produto)) {
      return;
    }

    const missingFields = requiredHeaders.filter((header) => isEmpty(parsed[header]));

    if (missingFields.length > 0) {
      invalidRows.push({ line: rowIndex + 2, missingFields });
      return;
    }

    const named = {};

    Object.entries(parsed).forEach(([name, value]) => {
      named[headerAliases[name] ?? name] = value;
    });

    rows.push(named);
  });

  if (invalidRows.length > 0) {
    return { rows: [], error: describeMissingFields(invalidRows) };
  }

  if (rows.length === 0) {
    return { rows: [], error: MESSAGES.noValidRows };
  }

  return { rows, error: null };
};
