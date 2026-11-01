const SOUTH_AFRICA_TIME_ZONE = 'Africa/Johannesburg';

export function formatSouthAfricaDateTime(value) {
  if (!value) return 'Time unavailable';
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return 'Time unavailable';

  try {
    return new Intl.DateTimeFormat('en-ZA', {
      timeZone: SOUTH_AFRICA_TIME_ZONE,
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hourCycle: 'h23',
      timeZoneName: 'short',
    }).format(date);
  } catch {
    const local = new Date(date.getTime() + 2 * 60 * 60 * 1000);
    const pad = (part) => String(part).padStart(2, '0');
    return `${pad(local.getUTCDate())}/${pad(local.getUTCMonth() + 1)}/${local.getUTCFullYear()}, ${pad(local.getUTCHours())}:${pad(local.getUTCMinutes())} SAST`;
  }
}

export function formatSouthAfricaDate(value, options = {}) {
  if (!value) return '';
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  try {
    return new Intl.DateTimeFormat('en-ZA', {
      timeZone: SOUTH_AFRICA_TIME_ZONE,
      ...options,
    }).format(date);
  } catch {
    const local = new Date(date.getTime() + 2 * 60 * 60 * 1000);
    return local.toISOString().slice(0, 10);
  }
}
