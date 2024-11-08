'use client'

import type { ReactNode } from 'react'
import { useRouter } from 'next/navigation'

export function BackButton({ children }: { children: ReactNode }) {
  const router = useRouter()

  return (
    <button
      onClick={router.back}
      className="rounded bg-indigo-600 px-4 py-2 text-base font-semibold leading-7 text-white"
      data-testid="back-button"
    >
      {children}
    </button>
  )
}

export default BackButton
