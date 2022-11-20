import { checkAgainstBannedNumbers, generateTwoDifferentNumbers } from "./numberGenerator";

describe('numberGenerator', () => {
  it('should generate two random numbers', () => {
    // Arrange
    const min = 1;
    const max = 5;

    // Act
    const [num1, num2] = generateTwoDifferentNumbers(min, max);

    // Assert
    expect(num1).toBeGreaterThanOrEqual(min);
    expect(num1).toBeLessThanOrEqual(max);
    expect(num2).toBeGreaterThanOrEqual(min);
    expect(num2).toBeLessThanOrEqual(max);
  });

  it('should check against banned numbers', () => {
    // Arrange
    const number = 5;
    const bannedNumbers = [5, 6, 7, 8, 10];
    const expectedNumber = 9;

    // Act
    const num = checkAgainstBannedNumbers(number, bannedNumbers);

    // Assert
    expect(num).toBe(expectedNumber);
  });
});
