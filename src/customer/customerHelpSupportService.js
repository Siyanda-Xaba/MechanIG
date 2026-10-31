const helpSupportData = {
    topics: [
        {
            id: 'account-profile',
            title: 'Account & Profile',
            description: 'Manage your personal information, profile photo, notifications, security, and account preferences.',
        },
        {
            id: 'vehicles',
            title: 'Vehicles',
            description: 'Manage saved vehicles, primary vehicle selection, registration details, and vehicle information.',
        },
        {
            id: 'diagnostics',
            title: 'Diagnostics',
            description: 'Learn how diagnostic readings, AI interpretation, repair guidance, and mechanic assistance work.',
        },
        {
            id: 'fuel',
            title: 'Fuel',
            description: 'Get help with fuel delivery, nearby stations, emergency fuel, scheduled top-ups, and delivery tracking.',
        },
        {
            id: 'marketplace',
            title: 'Marketplace',
            description: 'Learn about part search, Search by Picture, vehicle compatibility, nearby stores, pricing, and availability.',
        },
        {
            id: 'bookings',
            title: 'Bookings & Mechanics',
            description: 'Get help with mechanic requests, workshop bookings, service status, and completed service records.',
        },
    ],
    faqItems: [
        {
            id: 'faq-diagnostics-readings',
            topicId: 'diagnostics',
            question: 'Where do diagnostic sensor readings come from?',
            answer: 'OBD readings are the source of truth for connected vehicle diagnostics. AI may interpret real readings, but it must not invent sensor values.',
        },
        {
            id: 'faq-diagnostics-mechanic',
            topicId: 'diagnostics',
            question: 'When should I contact a mechanic instead of attempting a repair?',
            answer: 'Safety-critical issues and repairs that are not appropriate for safe DIY guidance should be handled by a qualified mechanic.',
        },
        {
            id: 'faq-picture-compatibility',
            topicId: 'marketplace',
            question: 'Does Search by Picture guarantee that a part fits my vehicle?',
            answer: 'No. Image recognition can suggest a possible part, but vehicle compatibility must still be confirmed using validated vehicle and product data.',
        },
        {
            id: 'faq-marketplace-stock',
            topicId: 'marketplace',
            question: 'Are Marketplace prices and stock always current?',
            answer: 'Real pricing, stock, and availability must come from validated backend or provider data. MechanIQ should not fabricate live availability.',
        },
        {
            id: 'faq-multiple-vehicles',
            topicId: 'vehicles',
            question: 'Can I add more than one vehicle?',
            answer: 'Yes. MechanIQ supports multiple vehicles, with one selected vehicle used as the current vehicle across supported customer features.',
        },
        {
            id: 'faq-profile-photo',
            topicId: 'account-profile',
            question: 'Where can I change my profile photo?',
            answer: 'Your profile photo can be changed from Profile. Other areas of MechanIQ only display the saved profile image or a fallback avatar.',
        },
        {
            id: 'faq-fuel-tracking',
            topicId: 'fuel',
            question: 'How does fuel delivery tracking work?',
            answer: 'Fuel delivery status is expected to come from the delivery backend as the order progresses through states such as driver assigned, en route, arrived, delivering, and completed.',
        },
        {
            id: 'faq-service-history',
            topicId: 'bookings',
            question: 'Where does my service history come from?',
            answer: 'Service history should come from authoritative workshop and service backend records rather than locally fabricated service entries.',
        },
    ],
    supportContacts: [
        {
            channel: 'email',
            label: 'Email Support',
            value: null,
            isAvailable: false,
        },
        {
            channel: 'phone',
            label: 'Phone Support',
            value: null,
            isAvailable: false,
        },
        {
            channel: 'chat',
            label: 'Live Chat',
            value: null,
            isAvailable: false,
        },
    ],
};
export async function getCustomerHelpSupportData() {
    return helpSupportData;
}
