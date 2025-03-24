import { useState } from 'react'

export const App = () => {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        { count }
      </div>
      <button
        onClick={setCount.bind(null, (prevCount) => prevCount + 1)}
      >
        Click me
      </button>
    </>
  )
}
