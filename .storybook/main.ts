import type { StorybookConfig } from "@storybook/nextjs";

const config: StorybookConfig = {
  stories: ["../**/*.mdx", "../**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-onboarding",
    "@storybook/addon-interactions",
    {
      name: "@storybook/addon-styling",
      options: {},
    },
  ],
  framework: {
    name: "@storybook/nextjs",
    options: {},
  },
  docs: {
    autodocs: "tag",
  },
  babel: async (config) => ({
    ...config,
    presets: ["next/babel", "@babel/preset-typescript"],
    plugins: [
      "babel-plugin-macros",
      [
        "@emotion/babel-plugin-jsx-pragmatic",
        {
          export: "jsx",
          import: "__cssprop",
          module: "@emotion/react",
        },
      ],
      [
        "@babel/plugin-transform-react-jsx",
        {
          pragma: "__cssprop",
        },
        "emotion-css-prop",
      ],
    ],
  }),
};
export default config;
