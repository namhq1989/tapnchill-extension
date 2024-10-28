import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Sparkles } from 'lucide-react'
import { IAmbience } from '@/modules/ambience/types.ts'
import { Slider } from '@/components/ui/slider.tsx'
import useAmbiencesStore from '@/modules/ambience/store.ts'
import { useCallback } from 'react'

const side = 'right'

const AmbienceView = () => {
  const { ambiences, changeVolumeValue, toggleAmbience } = useAmbiencesStore()
  const totalAddedAmbiences = ambiences.filter((a) => a.isAdded).length

  const handleVolumeChange = useCallback(
    (id: string) => (value: number) => {
      changeVolumeValue(id, value)
    },
    [changeVolumeValue],
  )

  const handleToggleAmbience = async (id: string) => {
    await toggleAmbience(id)
  }

  return (
    <div className='flex cursor-pointer'>
      <Sheet key={side}>
        <SheetTrigger asChild>
          <Sparkles
            strokeWidth={1}
            size={32}
            className='cursor-pointer'
            fill={totalAddedAmbiences > 0 ? 'hsl(var(--primary))' : 'none'}
            stroke={
              totalAddedAmbiences > 0
                ? 'hsl(var(--primary))'
                : 'hsl(var(--foreground))'
            }
          />
        </SheetTrigger>
        <SheetContent side={side} className='w-full overflow-auto p-0'>
          <SheetHeader className='p-4'>
            <SheetTitle>Ambiences</SheetTitle>
          </SheetHeader>
          <div className='grid grid-cols-3 gap-4 p-4'>
            {ambiences.map((a) => {
              return (
                <AmbienceItem
                  key={a.name}
                  ambience={a}
                  isAdded={a.isAdded}
                  onVolumeChange={handleVolumeChange(a.id)}
                  onToggleAmbience={() => handleToggleAmbience(a.id)}
                />
              )
            })}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}

interface IAmbienceItemProps {
  ambience: IAmbience
  isAdded: boolean
  onVolumeChange: (value: number) => void
  onToggleAmbience: () => void
}

const AmbienceItem = (props: IAmbienceItemProps) => {
  const { ambience, isAdded } = props
  const IconComponent = ambience.icon

  return (
    <div
      key={ambience.id}
      className={`flex flex-col gap-8 px-4 py-4 rounded-xl hover:rounded-xl container-hover justify-center items-center ${isAdded ? 'container-selected' : ''}`}
    >
      <div
        className='flex w-full justify-center items-center cursor-pointer'
        onClick={props.onToggleAmbience}
      >
        <IconComponent size={44} strokeWidth={1} />
      </div>
      {isAdded ? (
        <Slider
          defaultValue={[ambience.volume]}
          value={[ambience.volume]}
          max={100}
          min={0}
          step={1}
          onValueChange={(value: number[]) => {
            props.onVolumeChange(value[0])
          }}
        />
      ) : (
        <div />
      )}
    </div>
  )
}

export default AmbienceView
