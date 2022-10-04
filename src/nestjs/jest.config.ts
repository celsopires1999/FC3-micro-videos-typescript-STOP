export default {
  displayName: {
    name: 'nestjs',
    color: 'magentaBright',
  },
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: 'src',
  testRegex: ['.*\\..*spec\\.ts$'],
  transform: {
    '^.+\\.(t|j)s$': '@swc/jest',
  },
  coverageProvider: 'v8',
  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageDirectory: '../__coverage',
  coverageReporters: ['json', 'html'],
  coverageThreshold: {
    global: {
      statements: 80,
      branches: 80,
      functions: 80,
      lines: 80,
    },
  },
  testEnvironment: 'node',
  moduleNameMapper: {
    '@fc/micro\\-videos/(.*)$':
      '<rootDir>/../../../node_modules/@fc/micro-videos/dist/$1',
    // '#seedwork/domain':
    //   '<rootDir>/../../../node_modules/@fc/micro-videos/dist/@seedwork/domain/index.js',
    '#seedwork/(.*)$':
      '<rootDir>/../../../node_modules/@fc/micro-videos/dist/@seedwork/$1',
    // '#category/domain':
    //   '<rootDir>/../../../node_modules/@fc/micro-videos/dist/category/domain.index.js',
    '#category/(.*)$':
      '<rootDir>/../../../node_modules/@fc/micro-videos/dist/category/$1',
  },
  // setupFilesAfterEnv: ['../../@core/src/@seedwork/domain/tests/jest.ts'],
};
