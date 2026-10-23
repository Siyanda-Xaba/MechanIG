import { AntDesign, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Asset } from 'expo-asset';

const EXPO_FONT_STYLE_ID = 'expo-generated-fonts';

function getFontUri(icon) {
  const source = Object.values(icon.font)[0];
  return Asset.fromModule(source).uri;
}

function ensureIconFontsAreRegistered() {
  if (typeof document === 'undefined') {
    return;
  }

  let style = document.getElementById(EXPO_FONT_STYLE_ID);

  if (!style) {
    style = document.createElement('style');
    style.id = EXPO_FONT_STYLE_ID;
    document.head.appendChild(style);
  }

  const registeredFamilies = new Set(
    Array.from(style.sheet?.cssRules ?? [])
      .filter((rule) => rule instanceof CSSFontFaceRule)
      .map((rule) => rule.style.fontFamily.replace(/^['"]|['"]$/g, ''))
  );

  const fonts = [
    ['ionicons', getFontUri(Ionicons)],
    ['material-community', getFontUri(MaterialCommunityIcons)],
    ['anticon', getFontUri(AntDesign)],
  ];

  fonts.forEach(([family, uri]) => {
    if (!registeredFamilies.has(family)) {
      style.sheet?.insertRule(
        `@font-face { font-family: "${family}"; src: url("${uri}"); font-display: swap; }`,
        style.sheet.cssRules.length
      );
    }
  });
}

// Expo's web font observer tests fonts with ordinary Latin letters. Icon fonts
// contain glyphs in the private-use range, so that test can time out even when
// the font file loaded successfully. Registering their @font-face rules before
// the first icon renders lets expo-font recognize them synchronously.
ensureIconFontsAreRegistered();

export default function IconFontBootstrap() {
  return null;
}
