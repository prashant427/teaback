import { FlatCompat } from '@eslint/eslintrc'
 
const compat = new FlatCompat({
  // import.meta.dirname is available after Node.js v20.11.0
  baseDirectory: import.meta.dirname,
})
 
const eslintConfig = [
  ...compat.config({
    extends: ['next/core-web-vitals', 'next/typescript'],
  }),
  // Add a lightweight "rules" override set to relax a few rules that
  // commonly fail CI/deploys. Keep these limited — prefer fixing issues
  // in code where practical.
  {
    rules: {
      // allow unused function arguments in some signatures (helps with Next.js handlers)
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      // warn (don't error) about missing hook deps to avoid blocking builds
      'react-hooks/exhaustive-deps': 'warn',
      // next/image rule sometimes forces image usage; relax for rapid dev
      '@next/next/no-img-element': 'off',
      // relax console usage during development / build
      'no-console': ['warn', { allow: ['warn', 'error', 'info'] }],
    },
  },
]
 
export default eslintConfig