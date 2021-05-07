module.exports = {
    displayName: 'build test',
    setupFiles: [
        '<rootDir>/setup-jest.js'
    ],
    transform: {
        '^.+\\.js$': 'babel-jest'
    },
    moduleNameMapper: {
        '^sham-ui$': '<rootDir>/../lib/index.js'
    },
    testMatch: [
        '<rootDir>/__tests__/**/*.js'
    ]
};
