module.exports = {
  transform: {
    '^.+\\.ts$': '<--MODULES_PATH-->/ts-jest',
  },
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(js|ts)$',
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  testEnvironment: 'node',
  moduleNameMapper: <--PACKAGE_ALIASES-->
};
