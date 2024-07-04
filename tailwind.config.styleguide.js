/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['src/styleguide/**/*.ts', 'src/styleguide/**/*.tsx'],
  prefix: 'sg-',
  theme: {
    extend: {},
  },
  plugins: [],
  corePlugins: {
    preflight: false,
  },
};
