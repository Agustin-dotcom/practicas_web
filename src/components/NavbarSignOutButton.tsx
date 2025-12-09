'use client'
import { ReactNode } from 'react'
import Link from 'next/link'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
export const navbarSignOutButtonClasses =
  'rounded-full p-2 text-gray-400 hover:text-white focus:text-white focus:outline-none focus:ring-2 focus:ring-white';

interface NavbarSignOutButtonProps {
  href: string;
  children: ReactNode;
}

export default function NavbarSignOutButton({ href, children }: NavbarSignOutButtonProps) {
    const router = useRouter()
    const [error, setError] = useState<string>('')
  const handleOnClick = async function (
      event: React.MouseEvent<HTMLButtonElement>
    ) {  
      event.preventDefault()
  
      const res = await fetch('/api/auth/signout', {
        method: 'POST',
      })
  
      if (res.ok) {
        setError('')
        router.push('/')
        router.refresh()
      }

    }
  return (
    <button className={navbarSignOutButtonClasses} onClick={handleOnClick}>
      {children}
    </button>
  )
}