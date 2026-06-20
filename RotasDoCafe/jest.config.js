module.exports = {
  preset: 'jest-expo',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testMatch: ['<rootDir>/src/tests/**/*.test.js'],
  moduleNameMapper: {
    '^@expo/vector-icons$': '<rootDir>/src/tests/__mocks__/@expo/vector-icons.js',
  },
}