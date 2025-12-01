import { ReactNode } from 'react'
import Link from 'next/link'


interface PurchaseCheckoutButtonProps {
  href: string;
  children: ReactNode;
  buttonText:string;
}

export default function PurchaseCheckoutButton({ buttonText,href, children }: PurchaseCheckoutButtonProps) {
  return (
    <Link href={href} className='w-24 self-center '>
      <button type="submit" className="mt-5 w-full bg-gray-900 text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition">
        {buttonText}
      </button>
      {children}
    </Link>
  )
}