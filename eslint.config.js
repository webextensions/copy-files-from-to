const globals = require('globals');
const js = require('@eslint/js');

module.exports = [
    {
        ignores: [
            'test/**/*.js',
            '!test/test.js'
        ]
    },
    js.configs.recommended,
    {
        languageOptions: {
            globals: {
                ...globals.node
            }
        },

        rules: {
            indent: ["error", 4],
            "linebreak-style": ["error", "unix"],
            "no-console": "off",
            "no-debugger": "off",
            "no-shadow": "off",
            quotes: "off",
            semi: ["error", "always"]
        }
    }
];
