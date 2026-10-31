import { Image } from 'react-native';
import { useTheme } from '../theme/ThemeContext';

const darkLogo = require('../../assets/images/mechaniq-logo.png');
const lightLogo = require('../../assets/images/mechaniq-logo-light.jpeg');
const lightAppLogo = require('../../assets/images/mechaniq-logo-light-app.png');

export default function ThemeLogo({ style, resizeMode = 'contain', matchAppBackground = false, ...imageProps }) {
    const { mode } = useTheme();

    return (
        <Image
            {...imageProps}
            accessibilityRole="image"
            resizeMode={resizeMode}
            source={mode === 'light' ? (matchAppBackground ? lightAppLogo : lightLogo) : darkLogo}
            style={style}
        />
    );
}
