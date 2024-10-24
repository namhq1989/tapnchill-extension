import { Moon, Sun } from 'lucide-react'
import { useTheme } from '@/components/theme/theme-provider'

export function ModeToggle() {
  const { setTheme, theme } = useTheme()

  return (
    <div className='cursor-pointer'>
      {theme === 'dark' ? (
        <Moon onClick={() => setTheme('light')} />
      ) : (
        <Sun onClick={() => setTheme('dark')} />
      )}
    </div>
  )
}
