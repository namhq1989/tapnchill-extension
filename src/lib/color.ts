const getColorClass = (
  color: string,
  type: 'text' | 'bg' = 'text',
  fallback: string = 'text-muted-foreground',
): string => {
  const colorClasses: { [key: string]: string } = {
    'red-600': `${type}-red-600`,
    'orange-600': `${type}-orange-600`,
    'yellow-600': `${type}-yellow-600`,
    'gray-600': `${type}-gray-600`,
    'muted-foreground': fallback || 'text-muted-foreground',
  }

  return colorClasses[color] || ''
}

export { getColorClass }
