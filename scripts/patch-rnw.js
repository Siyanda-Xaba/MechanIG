const fs = require('node:fs');
const path = require('node:path');

const rnwRoot = path.resolve(__dirname, '..', 'node_modules', 'react-native-web');

if (!fs.existsSync(rnwRoot)) {
  console.log('[patch-rnw] react-native-web not installed yet, skipping.');
  process.exit(0);
}

// 1. Patch dist/index.js (ESM)
const esmIndexPath = path.join(rnwRoot, 'dist', 'index.js');
if (fs.existsSync(esmIndexPath)) {
  let content = fs.readFileSync(esmIndexPath, 'utf8');
  if (!content.includes('codegenNativeComponent')) {
    content += `\n// Fabric codegen web bridge\nimport __RNW_View from './exports/View';\nexport const codegenNativeComponent = (name) => __RNW_View;\nexport const codegenNativeCommands = () => ({});\n`;
    fs.writeFileSync(esmIndexPath, content, 'utf8');
    console.log('[patch-rnw] Patched dist/index.js with codegenNativeComponent');
  }
}

// 2. Patch dist/cjs/index.js (CommonJS)
const cjsIndexPath = path.join(rnwRoot, 'dist', 'cjs', 'index.js');
if (fs.existsSync(cjsIndexPath)) {
  let content = fs.readFileSync(cjsIndexPath, 'utf8');
  if (!content.includes('exports.codegenNativeComponent')) {
    content += `\n// Fabric codegen web bridge\nexports.codegenNativeComponent = function(name) { return _View.default; };\nexports.codegenNativeCommands = function() { return {}; };\n`;
    fs.writeFileSync(cjsIndexPath, content, 'utf8');
    console.log('[patch-rnw] Patched dist/cjs/index.js with codegenNativeComponent');
  }
}

// 3. Create standalone export folders for direct subpath imports (if any)
function ensureFile(dir, file, code) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, file), code, 'utf8');
}

const componentEsmDir = path.join(rnwRoot, 'dist', 'exports', 'codegenNativeComponent');
ensureFile(componentEsmDir, 'index.js', `import View from '../View';\nexport default (name) => View;\n`);

const componentCjsDir = path.join(rnwRoot, 'dist', 'cjs', 'exports', 'codegenNativeComponent');
ensureFile(componentCjsDir, 'index.js', `"use strict";\nvar View = require('../View');\nmodule.exports = function(name) { return View.default || View; };\n`);

const commandsEsmDir = path.join(rnwRoot, 'dist', 'exports', 'codegenNativeCommands');
ensureFile(commandsEsmDir, 'index.js', `export default () => ({});\n`);

const commandsCjsDir = path.join(rnwRoot, 'dist', 'cjs', 'exports', 'codegenNativeCommands');
ensureFile(commandsCjsDir, 'index.js', `"use strict";\nmodule.exports = function() { return {}; };\n`);

console.log('[patch-rnw] Successfully bridged React Native Web codegen gap.');
