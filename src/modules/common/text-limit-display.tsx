interface ITextLimitDisplayProps {
  text: string
  limit: number
}

const TextLimitDisplay = ({ text, limit }: ITextLimitDisplayProps) => {
  const current = text.length

  return (
    <div className='flex justify-end w-full mx-2 my-2 px-4'>
      <span
        className={`text-sm font-bold ${current > limit ? 'text-red-500' : 'text-muted-foreground'}`}
      >
        {current}/{new Intl.NumberFormat().format(limit)}
      </span>
    </div>
  )
}

export default TextLimitDisplay
