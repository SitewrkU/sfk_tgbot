export function fixTime(time: string, pairNumber: number): string {
  const parts = time.split("-");
  const start = parts[0]!;
  const end = parts[1]!;

  const fixMinutes = (t: string, minutesToSubtract: number): string => {
    const timeParts = t.split(":");
    const hour = parseInt(timeParts[0]!, 10);
    const min = parseInt(timeParts[1]!, 10);
    
    let fixedMin = min - minutesToSubtract;
    let fixedHour: number = hour;

    if (fixedMin < 0) {
      fixedMin += 60;
      fixedHour -= 1;
    }

    return `${fixedHour}:${String(fixedMin).padStart(2, "0")}`;
  };

  const fixedStart = fixMinutes(start, (pairNumber - 1) * 10);
  const fixedEnd = fixMinutes(end, pairNumber * 10);

  return `${fixedStart}-${fixedEnd}`;
}