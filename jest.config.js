module.exports = {
  preset: 'ts-jest',
  "moduleNameMapper": {
    "\\.(scss|sass|css)$": "identity-obj-proxy"
  },
  testEnvironment: 'node',
  testMatch: [ "**/spec/**/*.[jt]s?(x)", "**/?(*.)+(spec|test).[jt]s?(x)" ],
  testPathIgnorePatterns: ['/examples/']
};
