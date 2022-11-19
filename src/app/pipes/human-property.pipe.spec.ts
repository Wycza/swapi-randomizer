import { HumanPropertyPipe } from './human-property.pipe';

describe('HumanPropertyPipe', () => {
  let pipe: HumanPropertyPipe;

  beforeEach(() => {
    pipe = new HumanPropertyPipe();
  })

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should format key correctly', () => {
    // Arrange
    const key = 'some_random_KEY';
    const expectedOutput = 'Some random key';

    // Act
    const output = pipe.transform(key);

    // Assert
    expect(output).toBe(expectedOutput);
  });
});
