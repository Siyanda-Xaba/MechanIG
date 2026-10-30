const fs = require('node:fs');
const path = require('node:path');
const { getDefaultConfig } = require('expo/metro-config');
const { resolve } = require('metro-resolver');

const config = getDefaultConfig(__dirname);
const reactNativeDirectory = path.join(__dirname, 'node_modules', 'react-native');
const webShimPath = path.resolve(__dirname, 'react-native-web-shim.js');
const codegenComponentShim = path.resolve(__dirname, 'src', 'shims', 'codegenNativeComponent.js');
const codegenCommandsShim = path.resolve(__dirname, 'src', 'shims', 'codegenNativeCommands.js');

// React Native 0.86's wildcard package exports are not yet handled correctly
// by Metro on Windows. Resolve React Native's own extensionless internal
// imports to their real JavaScript files.
config.resolver.unstable_enablePackageExports = false;
config.resolver.assetExts.push('glb', 'gltf', 'bin');

config.resolver.resolveRequest = (context, moduleName, platform) => {
  // Web platform shims for React Native 0.86 codegen compatibility
  if (platform === 'web') {
    if (moduleName === 'react-native') {
      return { type: 'sourceFile', filePath: webShimPath };
    }
    // Also redirect all react-native subpath imports (e.g. 'react-native/Libraries/ReactNative/UIManager')
    // to the web shim. Without this, native packages import UIManager and other
    // native-only APIs directly from the RN source, which crash on web because
    // they rely on native module bindings that don't exist in react-native-web.
    if (moduleName.startsWith('react-native/')) {
      return { type: 'sourceFile', filePath: webShimPath };
    }
    if (moduleName.includes('codegenNativeComponent')) {
      return { type: 'sourceFile', filePath: codegenComponentShim };
    }
    if (moduleName.includes('codegenNativeCommands')) {
      return { type: 'sourceFile', filePath: codegenCommandsShim };
    }
  }

  // Windows Path Resolution Fix for React Native internals
  let candidate = null;
  if (moduleName.startsWith('react-native/Libraries/')) {
    candidate = path.join(reactNativeDirectory, `${moduleName.slice('react-native/'.length)}.js`);
  } else if (context.originModulePath && context.originModulePath.startsWith(reactNativeDirectory) && moduleName.startsWith('./Libraries/')) {
    candidate = path.resolve(path.dirname(context.originModulePath), `${moduleName}.js`);
  }
  if (candidate && fs.existsSync(candidate)) {
    return { type: 'sourceFile', filePath: candidate };
  }

  return resolve(context, moduleName, platform);
};

module.exports = config;
