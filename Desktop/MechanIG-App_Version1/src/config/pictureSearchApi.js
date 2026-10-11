// Set EXPO_PUBLIC_PICTURE_SEARCH_API_URL in .env to the LAN address of the
// separate picture-search backend, for example http://192.168.1.25:3001.
// Do not use localhost here: Expo Go runs on the phone, not on this computer.
export const pictureSearchApiUrl =
  process.env.EXPO_PUBLIC_PICTURE_SEARCH_API_URL?.replace(/\/$/, '') ?? ''

export function getPictureSearchEndpoint(path) {
  if (!pictureSearchApiUrl) {
    throw new Error(
      'Picture search is not configured. Set EXPO_PUBLIC_PICTURE_SEARCH_API_URL to your computer’s Wi-Fi IP address and restart Expo.'
    )
  }

  return `${pictureSearchApiUrl}${path}`
}
