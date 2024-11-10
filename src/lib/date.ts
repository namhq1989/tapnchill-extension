const formatDate = (date: Date): string => {
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0') // Months are 0-based
  const year = date.getFullYear()

  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')

  return `${day}/${month}/${year}, ${hours}:${minutes}`
}

const getRemainingTime = (
  dueDate: Date | null,
): { remainingTime: string; color: string } => {
  if (!dueDate) {
    return {
      remainingTime: 'No due date',
      color: '',
    }
  }

  const now = new Date()
  const timeDiff = dueDate.getTime() - now.getTime()
  const daysDiff = timeDiff / (1000 * 60 * 60 * 24)

  let color: string
  let remainingTime: string

  // Determine if the due date is overdue
  if (daysDiff < 0) {
    // Overdue case
    color = 'red-600'
    remainingTime = 'Overdue'
  } else if (daysDiff <= 1) {
    // Close to Due Date (within 1 day)
    color = 'orange-600'
    const hours = Math.floor(timeDiff / (1000 * 60 * 60))
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60))

    if (hours > 0) {
      remainingTime = `${hours} hour${hours > 1 ? 's' : ''} left`
    } else {
      remainingTime = `${minutes} minute${minutes > 1 ? 's' : ''} left`
    }
  } else if (daysDiff <= 3) {
    // Approaching Due Date (within 3 days)
    color = 'yellow-600'
    remainingTime = `${Math.floor(daysDiff)} day${Math.floor(daysDiff) > 1 ? 's' : ''} left`
  } else {
    // Default for tasks far from due date
    color = 'muted-foreground'
    remainingTime =
      dueDate.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }) +
      ', ' +
      dueDate.toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
      })
  }

  return { remainingTime, color }
}

const getTotalTimeTaken = (
  createdAt: Date,
  completedAt: Date | null,
): string => {
  if (!completedAt) {
    return ''
  }

  const timeDiff = completedAt.getTime() - createdAt.getTime()

  // Calculate days, hours, and minutes
  const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24))
  const hours = Math.floor(
    (timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
  )
  const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60))

  // Format the output based on the rules
  if (days < 1) {
    if (hours === 0 && minutes === 0) {
      return '1m' // Minimum time display when less than 1 minute has passed
    }

    return `${hours}h ${minutes}m` // Less than 1 day
  } else if (days < 7) {
    return `${days}d ${hours}h` // Less than 7 days
  } else {
    return `${days}d` // 7 days or more
  }
}

export { formatDate, getRemainingTime, getTotalTimeTaken }
