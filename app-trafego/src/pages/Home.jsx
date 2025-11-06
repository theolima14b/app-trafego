import { useState } from 'react'
import reactLogo from '../assets/react.svg'
import viteLogo from '/vite.svg'

export default function Home() {
  const [count, setCount] = useState(0)

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div className="flex gap-8 mb-8">
        <a href="https://vite.dev" target="_blank" rel="noopener noreferrer">
          <img src={viteLogo} className="h-24 p-6 transition-all hover:drop-shadow-[0_0_2em_#646cffaa]" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank" rel="noopener noreferrer">
          <img src={reactLogo} className="h-24 p-6 transition-all hover:drop-shadow-[0_0_2em_#61dafbaa] hover:animate-spin" alt="React logo" />
        </a>
      </div>
      <h1 className="text-5xl font-bold mb-8">Vite + React</h1>
      <div className="p-8">
        <button 
          onClick={() => setCount((count) => count + 1)}
          className="px-6 py-3 bg-gray-800 text-white rounded-lg font-medium hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
        >
          count is {count}
        </button>
        <p className="mt-4 text-gray-600">
          Edit <code className="bg-gray-100 px-2 py-1 rounded">src/pages/Home.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="text-gray-500 text-sm">
        Click on the Vite and React logos to learn more
      </p>
    </div>
  )
}
