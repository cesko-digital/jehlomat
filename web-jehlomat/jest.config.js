module.exports = {
  // This is here because of "baseUrl": "./src" in tsconfig.json
  moduleDirectories: ["node_modules", "src"],
  testEnvironment: "jsdom",
  testMatch: ["**/__tests__/**/?(*.)+(spec).ts?(x)"],
  testPathIgnorePatterns: [
    "<rootDir>/build",
    "<rootDir>/node_modules",
    "<rootDir>/cypress",
  ],
  snapshotSerializers: [
    // display emotion styles not as className, but expanded
    "@emotion/jest/serializer",
  ],
  setupFilesAfterEnv: ["<rootDir>/src/tools/jest/jest.setup.ts"],
  moduleNameMapper: {
    "\\.svg": "<rootDir>/src/tools/jest/svgr.ts",
  },
}
