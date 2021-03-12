module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  collectCoverageFrom: ["src/**/*.{ts,js}"],
  moduleDirectories: ["node_modules", "src"],
  testPathIgnorePatterns: ["/node_modules/", "/dist/", "/coverage/"],
  transform: {
    "^.+\\.js?$": "babel-jest",
  },
}
