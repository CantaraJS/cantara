require('<--MODULES_PATH-->/ts-jest');

module.exports = {
  transform: {
    '^.+\\.ts$': '<--MODULES_PATH-->/ts-jest',
  },
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(js|ts)$',
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: <--MODULE_NAME_MAPPER-->
};
