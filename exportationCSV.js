const { createObjectCsvWriter } = require('csv-writer');

async function exportVersCSV(data, nomFichier, fields) {
  const csvWriter = createObjectCsvWriter({
    path: `${nomFichier}.csv`,
    header: fields.map(field => ({ id: field, title: field })),
  });

  await csvWriter.writeRecords(data);
  return `${nomFichier}.csv`;
}

module.exports = { exportVersCSV };