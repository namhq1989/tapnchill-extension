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
          <Sparkles strokeWidth={1} size={32} className='cursor-pointer' />
        </SheetTrigger>
        <SheetContent side={side} className='w-full overflow-auto p-0'>
          <SheetHeader className='p-4'>
            <SheetTitle>Ambiences</SheetTitle>
          </SheetHeader>
          <div className='grid grid-cols-2 gap-4 p-4'>
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
      className={`flex flex-col gap-8 px-4 py-8 rounded-xl hover:rounded-xl container-hover justify-center items-center ${isAdded ? 'container-selected' : ''}`}
    >
      <IconComponent
        size={40}
        strokeWidth={1}
        className='mr-1 cursor-pointer'
        onClick={props.onToggleAmbience}
      />
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
