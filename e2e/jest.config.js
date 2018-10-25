module.exports = {
    displayName: 'build test',
    setupFiles: [
        '<rootDir>/setup-jest.js'
    ],
    transform: {
        '^.+\\.js$': 'babel-jest'
    },
    moduleNameMapper: {
        '^sham-ui$': '<rootDir>/../lib/sham-ui.js'
    },
    testMatch: [
        '<rootDir>/__tests__/**/*.js'
    ]
};
