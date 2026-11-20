import { ScrollViewStyleReset } from 'expo-router/html';
import type { PropsWithChildren } from 'react';

import { colors } from '@/theme/main';

const resetCss = `
html, body, #root {
  margin: 0;
  padding: 0;
  border: 0;
  background-color: ${colors.blueIris};
}
body {
  padding-top: env(safe-area-inset-top, 0px);
  padding-right: env(safe-area-inset-right, 0px);
  padding-bottom: env(safe-area-inset-bottom, 0px);
  padding-left: env(safe-area-inset-left, 0px);
}
ul, ol {
  list-style: none;
  margin: 0;
  padding: 0;
  border: 0;
}
li {
  list-style: none;
  margin: 0;
  padding: 0;
  border: 0;
}
* {
  box-sizing: border-box;
  border-style: none;
}
`;

export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no, viewport-fit=cover"
        />
        <ScrollViewStyleReset />
        <style dangerouslySetInnerHTML={{ __html: resetCss }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
