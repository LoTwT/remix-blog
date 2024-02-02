// @ts-check

import { defineFlatConfig } from "@ayingott/eslint-config"

export default defineFlatConfig(
  [
    {
      rules: {
        "import/no-default-export": "off",
      },
    },
    {
      ignores: [".cache/**", "build/**", "public/build/**"],
    },
  ],
  {
    vue: false,
    unocss: false,
    prettier: true,
    react: true,
  },
)
