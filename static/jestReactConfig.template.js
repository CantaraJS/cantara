require('<--MODULES_PATH-->/ts-jest');

module.exports = {
  transform: {
    '^.+\\.tsx?$': '<--MODULES_PATH-->/ts-jest',
  },
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: <--MODULE_NAME_MAPPER-->
};
