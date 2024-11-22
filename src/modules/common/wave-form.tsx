const WaveForm = () => {
  return (
    <div id='bars'>
      {Array(5)
        .fill(0)
        .map((_, i) => (
          <div className='bar' key={i}></div>
        ))}
    </div>
  )
}

export default WaveForm
