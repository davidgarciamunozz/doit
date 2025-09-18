/**
 * @see https://prettier.io/docs/configuration
 * @type {import("prettier").Config}
 */
const prettierConfig = {
  semi: true,
  trailingComma: "all",
  singleQuote: false,
  quoteProps: "consistent",
  useTabs: false,
  bracketSpacing: true,
  bracketSameLine: false,
  objectWrap: "preserve",
  tabWidth: 2,
  printWidth: 80,
};

export default prettierConfig;
