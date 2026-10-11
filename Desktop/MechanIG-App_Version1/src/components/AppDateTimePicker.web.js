import React from 'react';

function pad(value) {
  return String(value).padStart(2, '0');
}

function formatValue(date, mode) {
  if (mode === 'time') return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export default function AppDateTimePicker({ value, mode = 'date', minimumDate, onChange }) {
  function handleChange(event) {
    if (!event.target.value) return;
    const selected = new Date(value);
    if (mode === 'time') {
      const [hours, minutes] = event.target.value.split(':').map(Number);
      selected.setHours(hours, minutes, 0, 0);
    } else {
      const [year, month, day] = event.target.value.split('-').map(Number);
      selected.setFullYear(year, month - 1, day);
    }
    onChange?.({ type: 'set', nativeEvent: { timestamp: selected.getTime() } }, selected);
  }

  return React.createElement('input', {
    type: mode,
    value: formatValue(value, mode),
    min: minimumDate && mode === 'date' ? formatValue(minimumDate, mode) : undefined,
    onChange: handleChange,
    'aria-label': mode === 'time' ? 'Select delivery time' : 'Select delivery date',
    style: {
      width: '100%', minHeight: 44, boxSizing: 'border-box', padding: '8px 10px',
      border: '1px solid #4b5563', borderRadius: 8, background: '#111827', color: '#ffffff',
      colorScheme: 'dark', fontSize: 14,
    },
  });
}
