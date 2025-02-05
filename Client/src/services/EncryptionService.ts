export const encryptData = (data: string): string => {
  const lines = data.split("\n");
  const header = lines[0];
  const dataRows = lines.slice(1);

  const processedRows = dataRows.map((row) => {
    const values = row.split(",");
    if (values.length === 4) {
      // Simple Base64 encoding function
      const encryptValue = (val: string) => {
        // Convert string to Base64
        const encoded = btoa(val);
        return encoded;
      };

      values[1] = `#ENC#${encryptValue(values[1])}#ENC#`;
      values[3] = `#ENC#${encryptValue(values[3])}#ENC#`;
    }
    return values.join(",");
  });

  return [header, ...processedRows].join("\n");
};
