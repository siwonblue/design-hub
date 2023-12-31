# error

스토리북 관련 에러인데 storybook 실행할때 아래 에러가 발생하면 yarn.lock 지우고 다시 설치해주면 된다.

```bash
...
const stringWidth = require('string-width');
..
```

# setting

1. [install nextjs] create-next-app --typescript 로 next + typescript 프로젝트 init
2. [install storybook with nextjs] docs https://storybook.js.org/recipes/next
3. [install tailwin css with nextjs] docs https://tailwindcss.com/docs/guides/nextjs
4. [install plugin tailwind css + stroybook] docs https://storybook.js.org/recipes/tailwindcss
5. [path alias] path alias 필요하면 tsconfig.json 에 추가
6. [deploy] docs https://storybook.js.org/tutorials/intro-to-storybook/react/ko/deploy/

---

7. twin macro 설치
   (emotion(ts) 를 이용한 방법.) docs https://github.com/ben-rogerson/twin.examples/tree/master/next-emotion-typescript
   docs 에 나와있는 예제를 다운받아서 해당 프로젝트를 분석해서 찾은 방법

### 7.1 next.js + twin macro 설치

twin.macro 와 emtion 을 함께 사용하기 위해서 emotion<>react, emotino<>styled-component 설치

```
yarn add @emotion/react @emotion/styled
```

twin.macro 설치

```
yarn -D add twin.macro
```

root/withTwin.js for babel (swc 를 사용한다면 아래 설정이 적용안될수도 있음.)

아래 설정은 babel 이 typescript, twinmacro, emotion 을 모두 커버하도록 규정한다.

```js
const path = require("path");

// The folders containing files importing twin.macro
const includedDirs = [path.resolve(__dirname, "src")];

module.exports = function withTwin(nextConfig) {
  return {
    ...nextConfig,
    webpack(config, options) {
      const { dev, isServer } = options;
      // Make the loader work with the new app directory
      const patchedDefaultLoaders = options.defaultLoaders.babel;
      patchedDefaultLoaders.options.hasServerComponents = false;
      patchedDefaultLoaders.options.hasReactRefresh = false;

      config.module = config.module || {};
      config.module.rules = config.module.rules || [];
      config.module.rules.push({
        test: /\.(tsx|ts)$/,
        include: includedDirs,
        use: [
          patchedDefaultLoaders,
          {
            loader: "babel-loader",
            options: {
              sourceMaps: dev,
              plugins: [
                require.resolve("babel-plugin-macros"),
                require.resolve("@emotion/babel-plugin"),
                [
                  require.resolve("@babel/plugin-syntax-typescript"),
                  { isTSX: true },
                ],
              ],
            },
          },
        ],
      });

      if (!isServer) {
        config.resolve.fallback = {
          ...(config.resolve.fallback || {}),
          fs: false,
          module: false,
          path: false,
          os: false,
          crypto: false,
        };
      }

      if (typeof nextConfig.webpack === "function") {
        return nextConfig.webpack(config, options);
      } else {
        return config;
      }
    },
  };
};
```

next.config.js 설정

```js
const withTwin = require("./withTwin.js");

/**
 * @type {import('next').NextConfig}
 */
module.exports = withTwin({
  reactStrictMode: true,
  experimental: {
    serverActions: true,
  },
});
```

### 7.2 next.js + twin macro => stroybook 적용

withTwin.js 과 next.config.js 에서 typescript, twin.macro 에 대한 설정을 모두 했는데, 이건 twin.macro <> next.js 간의 설정을 끝낸 것이다. storybook 까지 twin.macro 와 연결해주려면 이에 대해 storybook 에 대한 설정을 추가적으로 해주어야 한다.

babel-loader : 바벨 로더 설치  
babel-plugin-macros : 바벨로더 트윈매크로 연결 플러그인 설치  
@emotion/babel-plugin-jsx-pragmatic : 이모션을 사용하기 위한 바벨 플러그인 설치  
@babel/plugin-transform-react-jsx : 바벨 jsx 플러그인

for emotion

```bash
yarn add -D babel-loader babel-plugin-macros @emotion/babel-plugin-jsx-pragmatic @babel/plugin-transform-react-jsx
```

typescript babel 설정

```bash
yarn add -D @babel/preset-typescript
```

next<>bebel 을 연결해주고, 바벨이 타입스크립트를 해석할 수 있도록 한다.

```ts
  ...
   presets: ["next/babel", "@babel/preset-typescript"],
   ...
```

.storybook/main.ts

```ts
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
```

### 7.3 styled-components 추가

for styled-components

```bash
yarn add styled-components
yarn add -D @babel/plugin-syntax-typescript babel-plugin-styled-components
```

### 8. To avoid the ugly Flash Of Unstyled Content (FOUC), add the following in lib/registry.js:

docs https://nextjs.org/docs/app/building-your-application/styling/css-in-js#styled-components  
root/lib/registry.tsx 만들고 아래 복붙

```
'use client'

import React, { useState } from 'react'
import { useServerInsertedHTML } from 'next/navigation'
import { StyleRegistry, createStyleRegistry } from 'styled-jsx'

export default function StyledJsxRegistry({
  children,
}: {
  children: React.ReactNode
}) {
  // Only create stylesheet once with lazy initial state
  // x-ref: https://reactjs.org/docs/hooks-reference.html#lazy-initial-state
  const [jsxStyleRegistry] = useState(() => createStyleRegistry())

  useServerInsertedHTML(() => {
    const styles = jsxStyleRegistry.styles()
    jsxStyleRegistry.flush()
    return <>{styles}</>
  })

  return <StyleRegistry registry={jsxStyleRegistry}>{children}</StyleRegistry>
}
```
