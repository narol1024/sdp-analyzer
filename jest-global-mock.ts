/**
 * This is a sample test suite.
 * Replace this with your implementation.
 */
import { exec } from 'child_process';
import fetch from 'node-fetch';

jest.mock('child_process');
jest.mock('node-fetch');

process.argv = ['node', './cli', 'analyze', 'react'];

const dependantsHtml = `
  <html>
    <body>
      <a id="package-tab-dependents" tabindex="0"><span><svg></svg>10000 Dependents</span></a>
    </body>
  </html>
`;

(exec as any).mockImplementation((command: any, callback: any) => {
  if (command.includes('is-a-non-existent-package')) {
    callback(null, { stdout: '{"error": { "code": "E404" }}' });
  } else if (/react@\d+\.\d+\.\d+/.test(command)) {
    callback(null, {
      stdout: `{ "fbjs": "^0.8.16", "prop-types": "^15.6.0", "loose-envify": "^1.1.0", "object-assign": "^4.1.1" }`,
    });
  } else if (/vue@\d+\.\d+\.\d+/.test(command)) {
    callback(null, {
      stdout: `{ "@vue/shared": "3.0.0", "@vue/compiler-dom": "3.0.0", "@vue/runtime-dom": "3.0.0" }`,
    });
  } else if (/\sreact\s/.test(command)) {
    callback(null, { stdout: '{ "loose-envify": "^1.1.0" }' });
  } else if (/\svue\s/.test(command)) {
    callback(null, {
      stdout: `{  "@vue/shared": "3.4.27", "@vue/compiler-dom": "3.4.27", "@vue/compiler-sfc": "3.4.27", "@vue/runtime-dom": "3.4.27", "@vue/server-renderer": "3.4.27" }`,
    });
  } else {
    callback(null, { stdout: '{}' });
  }
});

(fetch as any).mockImplementation((args: any) => {
  // It returns 404 status when fetching a invalid package.
  if (args.includes('is-a-non-existent-package')) {
    return Promise.resolve({
      status: 404,
      text: () => '',
    });
  }
  return Promise.resolve({
    status: 200,
    text: () => dependantsHtml,
  });
});
