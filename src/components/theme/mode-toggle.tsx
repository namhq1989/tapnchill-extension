import { Moon, Sun } from 'lucide-react'
import { useTheme } from '@/components/theme/theme-provider'

export function ModeToggle() {
  const { setTheme, theme } = useTheme()

  return (
    <div className='cursor-pointer'>
      {theme === 'dark' ? (
        <Moon size={20} onClick={() => setTheme('light')} />
      ) : (
        <Sun size={20} onClick={() => setTheme('dark')} />
      )}
    </div>
  )
}
