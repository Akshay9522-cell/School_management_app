export function generateSKU(name: string, unit: string) {
  const prefix = name.slice(0, 3).toUpperCase();  
  const unitPrefix = unit.slice(0, 3).toUpperCase();
  const random = Math.floor(10000 + Math.random() * 90000);

  return `${prefix}-${unitPrefix}-${random}`;
}
