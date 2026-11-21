const eslint = require('@eslint/js');
const tseslint = require('typescript-eslint');
const angular = require('angular-eslint');
const { defineConfig } = require('eslint/config');

module.exports = defineConfig(
    {
        ignores: ['projects/**/*', 'www/**/*']
    },
    {
        files: ['**/*.ts'],
        extends: [
            eslint.configs.recommended,
            ...tseslint.configs.recommended,
            ...angular.configs.tsRecommended
        ],
        processor: angular.processInlineTemplates,
        languageOptions: {
            parserOptions: {
                projectService: true,
                tsconfigRootDir: __dirname
            }
        },
        rules: {
            '@typescript-eslint/no-deprecated': 'error',
            '@angular-eslint/prefer-standalone': 'off',
            '@angular-eslint/component-class-suffix': [
                'error',
                {
                    suffixes: ['Page', 'Component']
                }
            ],
            '@angular-eslint/component-selector': [
                'error',
                {
                    type: 'element',
                    prefix: 'app',
                    style: 'kebab-case'
                }
            ],
            '@angular-eslint/directive-selector': [
                'error',
                {
                    type: 'attribute',
                    prefix: 'app',
                    style: 'camelCase'
                }
            ]
        }
    },
    {
        files: ['**/*.html'],
        extends: [
            ...angular.configs.templateRecommended
        ],
        rules: {}
    }
);
