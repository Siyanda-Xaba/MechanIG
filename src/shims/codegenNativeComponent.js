const ReactNativeWeb = require('react-native-web');

function codegenNativeComponent(name) {
  return ReactNativeWeb.View;
}

codegenNativeComponent.default = codegenNativeComponent;
module.exports = codegenNativeComponent;
