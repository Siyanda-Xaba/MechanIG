import {
  useLocalSearchParams,
  useRouter,
} from 'expo-router'

import ConversationChatScreen from '../../src/messaging/ConversationChatScreen'

const PREVIEW_CONVERSATION_ID = 'preview-conversation-001'

export default function MechanicConversationScreen() {
  const router = useRouter()

  const {
    conversationId: routeConversationId,
    preview: routePreview,
  } = useLocalSearchParams()

  const conversationId =
    typeof routeConversationId === 'string'
      ? routeConversationId
      : ''

  const previewMode =
    __DEV__ &&
    routePreview === '1' &&
    conversationId === PREVIEW_CONVERSATION_ID

  function handleBack() {
    if (router.canGoBack()) {
      router.back()
      return
    }

    router.replace('/mechanic-messages')
  }

  return (
    <ConversationChatScreen
      conversationId={conversationId}
      participantRole="customer"
      previewMode={previewMode}
      onBack={handleBack}
    />
  )
}
