export default [
    {
        files: ['src/**/*.js'],
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            globals: {
                Cesium: 'readonly',
                window: 'readonly',
                document: 'readonly',
                fetch: 'readonly',
                URLSearchParams: 'readonly',
                Image: 'readonly',
                console: 'readonly',
                setTimeout: 'readonly',
                setInterval: 'readonly',
                clearInterval: 'readonly',
                alert: 'readonly',
                Blob: 'readonly',
                URL: 'readonly',
                FileReader: 'readonly',
            },
        },
        rules: {
            'no-unused-vars': 'warn',
            'no-undef': 'error',
        },
    },
];
