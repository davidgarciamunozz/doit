import path from "path";

const buildEslintCommand = (filenames) =>
  `pnpm run lint --fix --max-warnings=0 ${filenames.map((f) => path.relative(process.cwd(), f)).join(" ")}`;

const lintStagedConfig = {
  "*.{js,jsx,ts,tsx}": [buildEslintCommand],
  "**/*": "prettier --write --ignore-unknown",
};

export default lintStagedConfig;
