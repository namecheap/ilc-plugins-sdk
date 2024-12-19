module.exports = {
    all: true,
    reporter: 'text',
    'check-coverage': true,
    lines: 0,
    'per-file': true,
    exclude: ['**/*.spec.ts', 'dist', 'node_modules', 'browser.js', 'browser.d.ts'],
};
