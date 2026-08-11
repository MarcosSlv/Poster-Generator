import XLSX from 'xlsx-js-style';

const SHEET_NAME = 'Cartazes';
const PRODUCT_WIDTH = 48;
const FIELD_WIDTH = 12;

const BORDER_COLOR = 'FFBFBFBF';
const HEADER_FILL = 'FFF4F4F0';

const edge = { style: 'thin', color: { rgb: BORDER_COLOR } };
const border = { top: edge, bottom: edge, left: edge, right: edge };

const HEADER_STYLE = {
  font: { bold: true },
  alignment: { horizontal: 'center', vertical: 'center' },
  fill: { patternType: 'solid', fgColor: { rgb: HEADER_FILL } },
  border
};

const cellStyle = (isProduct) => ({
  alignment: { horizontal: isProduct ? 'left' : 'center', vertical: 'center' },
  border
});

const isCurrencyColumn = (column, currencyHeaders) =>
  currencyHeaders.includes(column.toLowerCase());

const toCellValue = (value, isCurrency) => {
  if (value === null || value === undefined || value === '') {
    return '';
  }

  if (!isCurrency) {
    return String(value);
  }

  const parsed = parseFloat(String(value).replace(',', '.'));

  return isNaN(parsed) ? String(value) : parsed;
};

const applyStyles = (worksheet, columns, rowCount) => {
  columns.forEach((column, columnIndex) => {
    const isProduct = column === 'produto';

    for (let rowIndex = 0; rowIndex <= rowCount; rowIndex += 1) {
      const address = XLSX.utils.encode_cell({ c: columnIndex, r: rowIndex });

      if (!worksheet[address]) {
        worksheet[address] = { t: 's', v: '' };
      }

      worksheet[address].s = rowIndex === 0 ? HEADER_STYLE : cellStyle(isProduct);
    }
  });
};

export const buildWorkbook = (rows, layout) => {
  const { columns, columnLabels, currencyHeaders } = layout;

  const body = rows.map((row) =>
    columns.map((column) => toCellValue(row[column], isCurrencyColumn(column, currencyHeaders))));

  const worksheet = XLSX.utils.aoa_to_sheet([columnLabels, ...body]);

  worksheet['!cols'] = columns.map((column) =>
    ({ wch: column === 'produto' ? PRODUCT_WIDTH : FIELD_WIDTH }));

  applyStyles(worksheet, columns, rows.length);

  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workbook, worksheet, SHEET_NAME);

  return workbook;
};

export const downloadSheet = (rows, layout, fileName) => {
  XLSX.writeFile(buildWorkbook(rows, layout), fileName);
};
