export function zeroPadding(num: number, digit: number): string {
  return ('0'.repeat(digit) + String(num)).slice( (-1 * digit) );
}