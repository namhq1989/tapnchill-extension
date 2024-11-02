import useQuoteStore from '@/modules/quote/store.ts'
import { useEffect } from 'react'

const QuotePreview = () => {
  const { quote, getQuote } = useQuoteStore()

  useEffect(() => {
    const fetchData = async () => {
      await getQuote()
    }
    fetchData().then()
  }, [getQuote])

  if (!quote) return null

  return (
    <div className='flex w-full p-4'>
      <blockquote className='border-l-4 pl-6 py-2 italic text-sm'>
        {quote.content} - {quote.author}
      </blockquote>
    </div>
  )
}

export default QuotePreview
