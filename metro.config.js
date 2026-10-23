const fs = require('node:fs')
const path = require('node:path')
const { getDefaultConfig } = require('expo/metro-config')

const config = getDefaultConfig(__dirname)
const reactNativeDirectory = path.join(__dirname, 'node_modules', 'react-native')

// React Native 0.86's wildcard package exports are not yet handled correctly
// by Metro on Windows. Resolve React Native's own extensionless internal
// imports to their real JavaScript files.
config.resolver.unstable_enablePackageExports = false

const shims = {
  '@react-native-community/netinfo': path.join(__dirname, 'src', 'shims', 'netinfo.js'),
  'expo-crypto': path.join(__dirname, 'src', 'shims', 'crypto.js'),
  'expo-secure-store': path.join(__dirname, 'src', 'shims', 'secureStore.js'),
  'expo-notifications': path.join(__dirname, 'src', 'shims', 'notifications.js'),
}

config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (shims[moduleName] && fs.existsSync(shims[moduleName])) {
    return { type: 'sourceFile', filePath: shims[moduleName] }
  }
  let candidate = null
  if (moduleName.startsWith('react-native/Libraries/')) {
    candidate = path.join(reactNativeDirectory, `${moduleName.slice('react-native/'.length)}.js`)
  } else if (context.originModulePath.startsWith(reactNativeDirectory) && moduleName.startsWith('./Libraries/')) {
    candidate = path.resolve(path.dirname(context.originModulePath), `${moduleName}.js`)
  }
  if (candidate && fs.existsSync(candidate)) return { type: 'sourceFile', filePath: candidate }
  // Metro passes its own default resolver here. Calling an imported resolver
  // can recurse when Expo and the project contain different Metro versions.
  return context.resolveRequest(context, moduleName, platform)
}

config.resolver.assetExts.push('glb', 'gltf', 'bin')
module.exports = config
