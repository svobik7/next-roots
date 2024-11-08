'use client'

import {
  useCallback,
  useRef,
  useEffect,
  ReactNode,
  MouseEventHandler,
} from 'react'
import { useRouter } from 'next/navigation'

export default function Modal({ children }: { children: ReactNode }) {
  const overlay = useRef<HTMLDivElement>(null)
  const wrapper = useRef<HTMLDivElement>(null)
  const router = useRouter()

  const onClick: MouseEventHandler = (e) => {
    if (e.target === overlay.current || e.target === wrapper.current) {
      router.back()
    }
  }

  const onKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') router.back()
    },
    [router]
  )

  useEffect(() => {
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [onKeyDown])

  return (
    <div
      ref={overlay}
      className="fixed inset-0 z-10 mx-auto overflow-y-auto bg-black/60"
      onClick={onClick}
      data-testid="modal"
    >
      <div
        ref={wrapper}
        className="absolute left-1/2 top-0 w-full max-w-7xl -translate-x-1/2 p-6 lg:top-1/2 lg:-translate-y-1/2 lg:px-8"
      >
        {children}
      </div>
    </div>
  )
}
