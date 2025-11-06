import { useState } from 'react'

export default function Header() {
  // Dispara evento customizado para abrir o menu drawer
  const handleHamburgerClick = () => {
    const event = new CustomEvent('open-mobile-menu')
    window.dispatchEvent(event)
  }

  return (
    <header className="fixed top-0 left-0 right-0 h-[8.5vw] min-h-[50px] max-h-[72px] bg-gray-900 text-blue-50 flex items-center justify-center z-[1100] shadow-md pl-[16vw] pr-[4vw] border-b border-white md:max-[900px]:pl-[12vw] md:max-[900px]:h-[9vw] md:max-[900px]:min-h-[40px] md:max-[900px]:max-h-[56px] max-[640px]:pl-12 max-[640px]:pr-4 max-[640px]:h-[12vw] max-[640px]:min-h-[36px] max-[640px]:max-h-[48px]">
      <span className="text-[2vw] font-bold tracking-tight absolute left-1/2 -translate-x-1/2 whitespace-nowrap m-0 text-center md:max-[900px]:text-[1.2rem] max-[640px]:text-base">
        Copiloto de Conversão
      </span>
      <button
        className="hidden md:max-[900px]:flex max-[640px]:flex absolute left-3 max-[640px]:left-2 top-1/2 -translate-y-1/2 bg-transparent border-none z-[1200] w-7 h-7 p-0.5 m-0 shadow-none items-center justify-center flex-col gap-0.5"
        aria-label="Abrir menu"
        onClick={handleHamburgerClick}
      >
        <span className="w-[18px] h-0.5 bg-white rounded-sm self-start shadow-[0_0_6px_2px_#000,0_0_0_1.5px_#fff] transition-all" />
        <span className="w-[18px] h-0.5 bg-white rounded-sm self-start shadow-[0_0_6px_2px_#000,0_0_0_1.5px_#fff] transition-all" />
        <span className="w-[18px] h-0.5 bg-white rounded-sm self-start shadow-[0_0_6px_2px_#000,0_0_0_1.5px_#fff] transition-all" />
      </button>
    </header>
  )
}