export default {
  projects: ["<rootDir>/src/@core", "<rootDir>/src/nestjs"],
  coverageDirectory: "<rootDir>/__coverage",
  coverageThreshold: {
    global: {
      statements: 80,
      branches: 80,
      functions: 80,
      lines: 80,
    },
  },
};
