import { IAmbience } from '@/modules/ambience/types.ts'
import { Slider } from '@/components/ui/slider.tsx'
import useAmbiencesStore from '@/modules/ambience/store.ts'
import { useCallback } from 'react'
import HeaderTitle from '@/header-title.tsx'
import BackButton from '@/back-button.tsx'

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
    <div className='flex flex-col w-[400px] min-h-[600px] scrollbar-hide'>
      <div className='flex w-full flex-row justify-between p-4 border-b-[1px]'>
        <BackButton />
        <HeaderTitle title='Ambiences' />
      </div>
      <div className='flex flex-col gap-4 scrollbar-hide'>
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
      </div>
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
