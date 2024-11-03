import WaveForm from '@/wave-form.tsx'
import useStationsStore from '@/modules/station/store.ts'

interface IHeaderTitleProps {
  title: string
}

const HeaderTitle = (props: IHeaderTitleProps) => {
  const { isPlaying } = useStationsStore()

  return (
    <div className='flex flex-row gap-4 justify-center'>
      <h2 className='text-base text-primary font-bold tracking-wide'>
        {props.title}
      </h2>
      {isPlaying && <WaveForm />}
    </div>
  )
}

export default HeaderTitle
