/**
 * Convert a numeric grade (0–100) to a letter grade using the English/British system.
 *
 * 70–100  => A
 * 60–69   => B
 * 50–59   => C
 * 40–49   => D
 * below 40 => F
 */
export function getLetterGrade(numeric: number | null | undefined): string {
  if (numeric == null || isNaN(numeric)) return "";
  if (numeric >= 70) return "A";
  if (numeric >= 60) return "B";
  if (numeric >= 50) return "C";
  if (numeric >= 40) return "D";
  return "F";
}
