export default {
  ...require('../jest.config').default,
  rootDir: './',
  testRegex: ['.*\\.e2e-spec\\.ts$'],
  maxWorkers: 1,
  moduleNameMapper: {
    '@fc/micro\\-videos/(.*)$':
      '<rootDir>/../../../node_modules/@fc/micro-videos/dist/$1',
    '#seedwork/(.*)$':
      '<rootDir>/../../../node_modules/@fc/micro-videos/dist/@seedwork/$1',
    '#category/(.*)$':
      '<rootDir>/../../../node_modules/@fc/micro-videos/dist/category/$1',
  },
};
