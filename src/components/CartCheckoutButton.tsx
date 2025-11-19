import { ReactNode } from 'react'
import Link from 'next/link'

export const cartCheckoutButtonClasses =
  'rounded-full p-2 text-gray-400 hover:text-white focus:text-white focus:outline-none focus:ring-2 focus:ring-white';

interface CartCheckoutButtonProps {
  href: string;
  children: ReactNode;
}

export default function CartCheckoutButton({ href, children }: CartCheckoutButtonProps) {
  return (
    <Link href={href} className={cartCheckoutButtonClasses}>
      {children}
    </Link>
  )
}