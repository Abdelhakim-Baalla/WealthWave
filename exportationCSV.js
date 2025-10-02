const { createObjectCsvWriter } = require("csv-writer");

async function exportToCSV(data, fileName) {
  if (!data || data.length === 0) {
    return null;
  }

  const fields = Object.keys(data[0]);

  const csvWriter = createObjectCsvWriter({
    path: `${fileName}.csv`,

    header: fields.map((field) => ({ id: field, title: field })),
  });

  await csvWriter.writeRecords(data);

  return `${fileName}.csv`;
}

module.exports = { exportToCSV };
