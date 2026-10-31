const CODE_CAUSES = {
  P0101: { title: 'Airflow measurement or intake issue', part: 'engine', next: 'Check the intake duct, air filter, MAF sensor and wiring before replacing parts.' },
  P0118: { title: 'Coolant temperature sensor circuit issue', part: 'cooling', next: 'Inspect the coolant sensor connector and wiring, then test the sensor.' },
  P0128: { title: 'Engine warming up too slowly', part: 'cooling', next: 'Check coolant level and thermostat operation; the code alone does not identify the failed part.' },
  P0133: { title: 'Slow oxygen-sensor response', part: 'engine', next: 'Check the sensor wiring and exhaust for leaks before replacing the sensor.' },
  P0135: { title: 'Oxygen-sensor heater circuit issue', part: 'engine', next: 'Inspect the heater fuse, connector and wiring, then test the sensor.' },
  P0171: { title: 'Fuel mixture too lean (Bank 1)', part: 'engine', next: 'Check for intake leaks, fuel delivery issues and MAF measurement errors.' },
  P0300: { title: 'Engine misfire detected', part: 'engine', next: 'Have ignition, fuel delivery and engine condition checked promptly.' },
  P0420: { title: 'Catalyst efficiency below threshold', part: 'engine', next: 'Check for exhaust leaks, misfires and oxygen-sensor issues before considering a catalytic converter.' },
  P0442: { title: 'Small evaporative-emissions leak', part: 'engine', next: 'Check the fuel cap seal and EVAP hoses; a smoke test may be needed.' },
  P0455: { title: 'Large evaporative-emissions leak', part: 'engine', next: 'Check the fuel cap and EVAP hoses and valves for an open connection or leak.' },
  P0500: { title: 'Vehicle-speed signal issue', part: 'wheel', next: 'Have the speed sensors, wiring and connectors inspected.' },
  P0562: { title: 'Low vehicle electrical-system voltage', part: 'battery', next: 'Test the battery, alternator output, terminals and ground connections.' },
};

function validReading(readings, pid) {
  const reading = readings.find((item) => item.pid === pid && item.supported !== false);
  return reading && reading.value != null && Number.isFinite(Number(reading.value)) ? Number(reading.value) : null;
}

function makeFinding({ id, title, part, score, evidence, next, source }) {
  return {
    id,
    title,
    part,
    score: Math.max(35, Math.min(95, Math.round(score))),
    evidence,
    next,
    source,
  };
}

export function analyzeLiveDiagnostics(readings = [], dtcProblems = []) {
  const findings = [];
  const codes = new Set(dtcProblems.map((problem) => problem.code?.toUpperCase()).filter(Boolean));

  for (const problem of dtcProblems) {
    const code = problem.code?.toUpperCase();
    const cause = CODE_CAUSES[code];
    if (!cause) continue;
    const evidence = [`OBD scan returned ${code}: ${problem.title || cause.title}.`];
    let score = 78;

    if (code === 'P0562') {
      const volts = validReading(readings, '42');
      if (volts != null) {
        evidence.push(`Control module voltage is ${volts.toFixed(1)} V.`);
        if (volts < 13.2) score += 10;
        else {
          score -= 8;
          evidence.push('This live reading does not currently reproduce the low-voltage condition.');
        }
      }
    }
    if (code === 'P0171') {
      const trims = ['06', '07', '08', '09'].map((pid) => validReading(readings, pid)).filter((value) => value != null);
      if (trims.some((value) => value >= 15)) {
        evidence.push('One or more live fuel-trim readings show the ECU adding substantial fuel.');
        score += 8;
      }
    }
    if (code === 'P0128') {
      const coolant = validReading(readings, '05');
      if (coolant != null) evidence.push(`Live coolant temperature is ${coolant.toFixed(1)} °C; engine warm-up time is not available to this model.`);
    }

    findings.push(makeFinding({
      id: code,
      title: cause.title,
      part: cause.part,
      score,
      evidence,
      next: cause.next,
      source: 'Trouble code plus available live readings',
    }));
  }

  const coolant = validReading(readings, '05');
  if (coolant != null && coolant >= 110 && !codes.has('P0118')) {
    findings.push(makeFinding({
      id: 'live-coolant-high',
      title: 'High coolant temperature reading',
      part: 'cooling',
      score: 62,
      evidence: [`The ECU currently reports ${coolant.toFixed(1)} °C coolant temperature.`],
      next: 'This is a temperature observation, not a confirmed failed part. Stop safely if a temperature warning appears and have the cooling system checked.',
      source: 'Live reading pattern',
    }));
  }

  const trims = ['06', '07', '08', '09'].map((pid) => ({ pid, value: validReading(readings, pid) })).filter((item) => item.value != null);
  const outlyingTrim = trims.find((item) => Math.abs(item.value) >= 20);
  if (outlyingTrim && !codes.has('P0171')) {
    findings.push(makeFinding({
      id: 'live-fuel-trim',
      title: 'Fuel-mixture correction is unusually large',
      part: 'engine',
      score: trims.length >= 2 ? 61 : 52,
      evidence: trims.map(({ pid, value }) => `${pid === '06' ? 'Short-term' : pid === '07' ? 'Long-term' : pid === '08' ? 'Short-term Bank 2' : 'Long-term Bank 2'} fuel trim: ${value.toFixed(1)}%.`),
      next: 'This does not identify the cause. A mechanic can check for intake leaks, fuel-delivery problems and sensor issues.',
      source: 'Live reading pattern',
    }));
  }

  const volts = validReading(readings, '42');
  const rpm = validReading(readings, '0C');
  if (volts != null && volts < 12 && !codes.has('P0562')) {
    findings.push(makeFinding({
      id: 'live-voltage-low',
      title: 'Low control-module voltage reading',
      part: 'battery',
      score: rpm != null && rpm > 500 ? 63 : 48,
      evidence: [`The ECU reports ${volts.toFixed(2)} V${rpm != null && rpm > 500 ? ` while engine speed is ${Math.round(rpm)} rpm` : ''}.`],
      next: 'Voltage can vary with engine state and vehicle design. Confirm with a battery and charging-system test before replacing anything.',
      source: 'Live reading pattern',
    }));
  }

  return findings.sort((a, b) => b.score - a.score).slice(0, 5);
}
