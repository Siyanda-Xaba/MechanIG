const mechanicHelpSupportData = {
  topics: [
    {
      id: 'account-profile',

      title: 'Account & Profile',

      description:
        'Manage your personal information, profile photo, notifications, security, verification, and mechanic account preferences.',
    },

    {
      id: 'jobs',

      title: 'Jobs',

      description:
        'Get help with pending, accepted, in-progress, completed, and cancelled mechanic jobs.',
    },

    {
      id: 'diagnostics',

      title: 'Diagnostics',

      description:
        'Review customer vehicle diagnostics, authoritative OBD data, diagnostic trouble codes, and mechanic diagnostic workflows.',
    },

    {
      id: 'customers',

      title: 'Customers',

      description:
        'Understand customer records, linked vehicles, bookings, open jobs, and supported customer communication history.',
    },

    {
      id: 'workshop-business',

      title: 'Workshop & Business',

      description:
        'Manage workshop details, service area, professional information, specialisation, supported vehicle brands, and verification information.',
    },

    {
      id: 'availability',

      title: 'Availability & Bookings',

      description:
        'Learn how mechanic availability, workshop bookings, service schedules, and job acceptance will work with backend-connected data.',
    },
  ],

  faqItems: [
    {
      id: 'faq-diagnostics-source',

      topicId: 'diagnostics',

      question:
        'Where do diagnostic readings shown to mechanics come from?',

      answer:
        'OBD readings and diagnostic trouble codes must come from authoritative vehicle, OBD, workshop, or backend sources. MechanIQ must not fabricate sensor values or diagnostic codes.',
    },

    {
      id: 'faq-diagnostics-ai',

      topicId: 'diagnostics',

      question:
        'Can AI create missing diagnostic readings?',

      answer:
        'No. AI may help interpret real diagnostic information, but it must never invent missing sensor values or diagnostic trouble codes.',
    },

    {
      id: 'faq-jobs-status',

      topicId: 'jobs',

      question:
        'Where do mechanic job statuses come from?',

      answer:
        'Job status should come from authoritative backend records shared between the customer and mechanic workflows. The frontend should not simulate production job acceptance, progress, or completion locally.',
    },

    {
      id: 'faq-customer-records',

      topicId: 'customers',

      question:
        'Where do customer and vehicle records come from?',

      answer:
        'Customer identity, vehicles, bookings, jobs, contact information, and history should come from backend-authoritative records associated with the authenticated mechanic.',
    },

    {
      id: 'faq-verification',

      topicId: 'workshop-business',

      question:
        'Why does my profile show that verification is not complete?',

      answer:
        'Verification should only be marked complete after the mechanic verification backend confirms the required identity, trade, and business documents.',
    },

    {
      id: 'faq-profile-photo',

      topicId: 'account-profile',

      question:
        'Where can I change my mechanic profile photo?',

      answer:
        'Your profile photo can be changed from Profile. Other mechanic screens should only display the saved profile image or a fallback avatar.',
    },

    {
      id: 'faq-availability',

      topicId: 'availability',

      question:
        'Why can I not configure availability yet?',

      answer:
        'Availability editing requires the mechanic availability backend contract so MechanIQ can store and share authoritative availability instead of pretending a local change was saved.',
    },

    {
      id: 'faq-bookings',

      topicId: 'availability',

      question:
        'How will workshop bookings stay synchronized with customers?',

      answer:
        'Customer bookings, mechanic acceptance, status changes, scheduling, and completion should be synchronized through the MechanIQ backend rather than through local frontend-only state.',
    },
  ],

  supportContacts: [
    {
      channel: 'email',

      label: 'Mechanic Email Support',

      value: null,

      isAvailable: false,
    },

    {
      channel: 'phone',

      label: 'Mechanic Phone Support',

      value: null,

      isAvailable: false,
    },

    {
      channel: 'chat',

      label: 'Mechanic Live Chat',

      value: null,

      isAvailable: false,
    },
  ],
}

export async function getMechanicHelpSupportData() {
  return mechanicHelpSupportData
}