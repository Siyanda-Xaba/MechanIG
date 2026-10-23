import {
  BookServiceLocationPreference,
} from './bookServiceScheduleTypes'

export type BookServiceDateOption = {
  value: string
  label: string
  secondaryLabel: string
}

export type BookServiceTimeOption = {
  value: string
  label: string
  description: string
}

export type BookServiceLocationOption = {
  id: BookServiceLocationPreference
  title: string
  description: string
}

function formatDateValue(date: Date): string {
  const year = date.getFullYear()
  const month = `${date.getMonth() + 1}`.padStart(
    2,
    '0'
  )
  const day = `${date.getDate()}`.padStart(2, '0')

  return `${year}-${month}-${day}`
}

export async function getBookServiceDateOptions(): Promise<
  BookServiceDateOption[]
> {
  const options: BookServiceDateOption[] = []

  const today = new Date()

  for (let dayOffset = 1; dayOffset <= 7; dayOffset += 1) {
    const date = new Date(today)

    date.setDate(today.getDate() + dayOffset)

    options.push({
      value: formatDateValue(date),

      label:
        dayOffset === 1
          ? 'Tomorrow'
          : date.toLocaleDateString('en-ZA', {
              weekday: 'short',
            }),

      secondaryLabel: date.toLocaleDateString(
        'en-ZA',
        {
          day: '2-digit',
          month: 'short',
        }
      ),
    })
  }

  return options
}

export async function getBookServiceTimeOptions(): Promise<
  BookServiceTimeOption[]
> {
  return [
    {
      value: '08:00',
      label: 'Morning',
      description: '08:00 – 11:00',
    },
    {
      value: '11:00',
      label: 'Midday',
      description: '11:00 – 14:00',
    },
    {
      value: '14:00',
      label: 'Afternoon',
      description: '14:00 – 17:00',
    },
  ]
}

export async function getBookServiceLocationOptions(): Promise<
  BookServiceLocationOption[]
> {
  return [
    {
      id: 'workshop',
      title: 'Workshop',
      description:
        'Take your vehicle to a suitable workshop.',
    },
    {
      id: 'mobile-service',
      title: 'Mobile Service',
      description:
        'Request a mechanic to service the vehicle at your location.',
    },
  ]
}