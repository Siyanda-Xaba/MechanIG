const fs = require('node:fs')
const path = require('node:path')
const { getDefaultConfig } = require('expo/metro-config')
const { resolve } = require('metro-resolver')

const config = getDefaultConfig(__dirname)
const reactNativeDirectory = path.join(__dirname, 'node_modules', 'react-native')

// React Native 0.86's wildcard package exports are not yet handled correctly
// by Metro on Windows. Resolve React Native's own extensionless internal
// imports to their real JavaScript files.
config.resolver.unstable_enablePackageExports = false
config.resolver.resolveRequest = (context, moduleName, platform) => {
  let candidate = null
  if (moduleName.startsWith('react-native/Libraries/')) {
    candidate = path.join(reactNativeDirectory, `${moduleName.slice('react-native/'.length)}.js`)
  } else if (context.originModulePath.startsWith(reactNativeDirectory) && moduleName.startsWith('./Libraries/')) {
    candidate = path.resolve(path.dirname(context.originModulePath), `${moduleName}.js`)
  }
  if (candidate && fs.existsSync(candidate)) return { type: 'sourceFile', filePath: candidate }
  return resolve(context, moduleName, platform)
}

config.resolver.assetExts.push('glb', 'gltf', 'bin')
module.exports = config