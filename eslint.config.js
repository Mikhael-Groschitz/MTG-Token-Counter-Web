import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import tseslint from 'typescript-eslint';

export default tseslint.config(
    { ignores: ['dist', '.tmp-scripts'] },
    {
        extends: [js.configs.recommended, ...tseslint.configs.recommended, jsxA11y.flatConfigs.recommended],
        files: ['**/*.{ts,tsx}'],
        languageOptions: {
            ecmaVersion: 2020,
            globals: globals.browser,
        },
        plugins: {
            'react-hooks': reactHooks,
            'react-refresh': reactRefresh,
        },
        rules: {
            // Only the classic hook-correctness rules — react-hooks v7's
            // "recommended" config pulls in the full React Compiler rule
            // set (set-state-in-effect, refs, purity, ...), which is a much
            // bigger stylistic overhaul than this a11y/SEO pass calls for.
            'react-hooks/rules-of-hooks': 'error',
            'react-hooks/exhaustive-deps': 'warn',
            'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
            // This is the first time ESLint has run on this project — the
            // codebase has pre-existing `catch (err: any)` patterns
            // throughout. Downgrading to warn surfaces them without failing
            // the lint script on unrelated pre-existing debt.
            '@typescript-eslint/no-explicit-any': 'warn',
            '@typescript-eslint/no-unused-vars': ['error', { ignoreRestSiblings: true }],
        },
    },
);
