module.exports = {
    all: true,
    reporter: ['text', 'html'],
    'check-coverage': true,
    lines: 0,
    'per-file': true,
    include: ['src/'],
    exclude: ['**/*.spec.ts', 'dist', 'node_modules', 'browser.js', 'browser.d.ts'],
};
