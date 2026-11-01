const developmentRepairGuides = [
    {
        id: 'repair-guide-001',
        diagnosticResultId: 'result-001',
        title: 'Routine Vehicle Check',
        description: 'Your latest diagnostic scan did not detect an immediate fault. Use this guide for basic preventative checks.',
        difficulty: 'Easy',
        estimatedMinutes: 10,
        diyEligible: true,
        safetyWarnings: [
            'Park the vehicle on a flat surface.',
            'Switch the engine off before performing physical checks.',
            'Do not touch hot engine components.',
        ],
        toolsRequired: [
            'Clean cloth',
            'Tyre pressure gauge',
        ],
        partsRequired: [],
        steps: [
            {
                id: 'step-001',
                order: 1,
                title: 'Check tyre condition',
                description: 'Inspect all tyres for visible damage, unusual wear, or low pressure.',
            },
            {
                id: 'step-002',
                order: 2,
                title: 'Check fluid levels',
                description: 'Check the vehicle fluid levels according to the manufacturer guidance.',
            },
            {
                id: 'step-003',
                order: 3,
                title: 'Check warning lights',
                description: 'Start the vehicle and confirm that no unexpected dashboard warning lights remain active.',
            },
        ],
        videos: [],
    },
];
export async function getRepairGuideByDiagnosticResult(diagnosticResultId) {
    // Later this will call the MechanIQ backend.
    // The backend will return validated repair guidance
    // and approved tutorial videos.
    return (developmentRepairGuides.find((guide) => guide.diagnosticResultId === diagnosticResultId) ?? null);
}
