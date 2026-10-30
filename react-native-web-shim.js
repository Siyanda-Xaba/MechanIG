// react-native-web-shim.js
const ReactNativeWeb = require('react-native-web');

function codegenNativeComponent(name) {
  return ReactNativeWeb.View;
}

function codegenNativeCommands() {
  return {};
}

// ─── UIManager web patch ──────────────────────────────────────────────────────
// Native-only modules (react-native-gesture-handler, react-native-reanimated,
// react-native-maps, etc.) call UIManager.hasViewManagerConfig() at startup.
// React Native Web's UIManager does not implement this method, causing a
// "UIManager.default.hasViewManagerConfig is not a function" crash on web.
// We patch it here so every import of 'react-native' on the web platform gets
// a UIManager that is safe to call.
const RNWUIManager = ReactNativeWeb.UIManager || {};
if (typeof RNWUIManager.hasViewManagerConfig !== 'function') {
  RNWUIManager.hasViewManagerConfig = function hasViewManagerConfig() {
    return false;
  };
}
if (typeof RNWUIManager.getViewManagerConfig !== 'function') {
  RNWUIManager.getViewManagerConfig = function getViewManagerConfig() {
    return null;
  };
}
if (typeof RNWUIManager.dispatchViewManagerCommand !== 'function') {
  RNWUIManager.dispatchViewManagerCommand = function dispatchViewManagerCommand() {};
}
// ─────────────────────────────────────────────────────────────────────────────

module.exports = {
  __esModule: true,
  ...ReactNativeWeb,
  UIManager: RNWUIManager,
  default: ReactNativeWeb.default || ReactNativeWeb,
  codegenNativeComponent,
  codegenNativeCommands,
};
