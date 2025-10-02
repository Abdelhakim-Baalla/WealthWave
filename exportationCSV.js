const fs = require("fs");
const { createObjectCsvWriter } = require("csv-writer");

async function exportToCSV(data, fileName) {
  if (!data || data.length === 0) {
    return null;
  }

  const fields = Object.keys(data[0]);

  const csvWriter = createObjectCsvWriter({
    path: `${fileName}.csv`,
    header: fields.map((field) => ({ id: field, title: field })),
    fieldDelimiter: ";",
    encoding: "utf8",
  });

  await csvWriter.writeRecords(data);

  const filePath = `${fileName}.csv`;
  const content = fs.readFileSync(filePath);
  if (!content.slice(0, 3).equals(Buffer.from([0xef, 0xbb, 0xbf]))) {
    fs.writeFileSync(
      filePath,
      Buffer.concat([Buffer.from([0xef, 0xbb, 0xbf]), content])
    );
  }

  return filePath;
}

module.exports = { exportToCSV };
