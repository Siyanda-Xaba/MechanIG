export type CustomerHelpTopicId =
  | 'account-profile'
  | 'vehicles'
  | 'diagnostics'
  | 'fuel'
  | 'marketplace'
  | 'bookings'

export type CustomerHelpTopic = {
  id: CustomerHelpTopicId
  title: string
  description: string
}

export type CustomerFaqItem = {
  id: string
  question: string
  answer: string
  topicId: CustomerHelpTopicId
}

export type CustomerSupportChannel =
  | 'email'
  | 'phone'
  | 'chat'

export type CustomerSupportContact = {
  channel: CustomerSupportChannel
  label: string
  value: string | null
  isAvailable: boolean
}

export type CustomerHelpSupportData = {
  topics: CustomerHelpTopic[]
  faqItems: CustomerFaqItem[]
  supportContacts: CustomerSupportContact[]
}