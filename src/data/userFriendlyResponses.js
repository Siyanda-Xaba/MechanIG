const SOUND_GUIDANCE = {
  BrakeSqueal: 'Ask a mechanic to check the brake pads and discs. If braking feels weak or unusual, stop somewhere safe and get help.',
  CVJoints: 'Ask a mechanic to inspect the joint and its rubber cover. If the clicking is getting worse, avoid hard turns and arrange a check.',
  EngineKnock: 'If the engine is making a loud knock, or an oil warning is showing, stop safely and arrange urgent help. Do not keep driving to test it.',
  SerpentineBelt: 'Ask a mechanic to check the belt and pulleys. If warning lights appear or steering suddenly feels heavy, stop safely.',
  StarterAlternator: 'Have the battery, charging system and starter checked. If the vehicle struggles to start or lights dim, arrange help before travelling far.',
  HealthySounds: 'This recording sounds similar to the model’s normal engine examples. That cannot rule out a problem. If the noise continues or the car feels different, arrange a check.',
  WheelBearing: 'Ask a mechanic to check the wheel bearing soon. Avoid high speeds if the humming or grinding is getting louder.',
};

export function formatSoundDiagnosisResponse(result) {
  const status = String(result?.status || '').toLowerCase();
  const firstMatch = Array.isArray(result?.top_results) ? result.top_results[0] : null;
  const matchId = firstMatch?.class_name;
  const isQuiet = status === 'silent_audio';
  const isInconclusive = status === 'inconclusive';
  const isHealthy = matchId === 'HealthySounds';

  if (isQuiet) {
    return 'We could not hear the sound clearly. Record again in a quieter place and hold the phone near the sound without touching moving or hot parts.';
  }
  if (isInconclusive) {
    return 'We could not match this sound confidently. Try recording again closer to the sound in a quieter place. If it keeps happening, ask a mechanic to check it.';
  }
  if (isHealthy) return SOUND_GUIDANCE.HealthySounds;

  const title = String(firstMatch?.title || '').trim();
  const nextStep = SOUND_GUIDANCE[matchId]
    || 'A sound pattern may need attention. Ask a mechanic to listen to the vehicle and check it before replacing any parts.';
  return `${title ? `Possible match: ${title}. ` : ''}${nextStep} This recording is a guide, not a confirmed diagnosis.`;
}

export function getFriendlyDiagnosticError(error, fallback) {
  const message = typeof error === 'string'
    ? error.trim()
    : error instanceof Error ? error.message.trim() : '';
  if (!message) return fallback;
  if (/^(Firebase:|auth\/|Error:)|\b(HTTP \d{3}|stack trace|undefined|null|permission denied|network request failed|backend|tensorflow|model files|traceback|exception|API key|Roboflow|Gemini|upstream|request failed|status code|endpoint)\b/i.test(message)) {
    return fallback;
  }
  return message;
}
