export function generateTwoDifferentNumbers(min: number = 1, max: number = 30, bannedNumbers: number[] = []): number[] {
  let num1 = Math.floor(Math.random() * max) + min;
  let num2 = Math.floor(Math.random() * max) + min;

  if (num1 === num2) {
    num2 += 1;
  }

  if (bannedNumbers.length) {
    num1 = checkAgainstBannedNumbers(num1, bannedNumbers);
    num2 = checkAgainstBannedNumbers(num2, bannedNumbers);
  }

  return [num1, num2];
}

export function checkAgainstBannedNumbers(num: number, bannedNumbers: number[]): number {
  let number = num;

  if (bannedNumbers.find(x => x === num)) {
    number = checkAgainstBannedNumbers(num + 1, bannedNumbers);
  }

  return number;
}