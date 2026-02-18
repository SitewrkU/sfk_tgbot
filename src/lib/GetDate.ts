export function getCurrentDate(): string {
  const d = new Date();
  return formatDate(d);
}

export function getNextDate(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1); // наступний день
  return formatDate(d);
}

function formatDate(d: Date): string {
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}.${month}.${year}`;
}