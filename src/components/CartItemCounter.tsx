'use client'

import { useRouter } from "next/navigation";
import { useState } from "react";

interface CartItemProps{
    userId:string,
    productId:string,
    value:number
}
export default function CartItemCounter({
  userId,
  productId,
  value
}:CartItemProps)
{
  const router = useRouter()
  const [isUpdating,setIsUpdating] = useState(false)

  const onPlusBtnClick = async function () {
    setIsUpdating(true)

    try {
      await fetch(`/api/users/${userId}/cart/${productId}`, {
        method: 'PUT',
        body: JSON.stringify({
          qty: value + 1,
        }),
      })
      router.refresh()
    } finally {
      setIsUpdating(false)
    }
  }

  const onMinusBtnClick = async function () {
    setIsUpdating(true)

    try {
      if (value > 1) {
        // decrement quantity
        await fetch(`/api/users/${userId}/cart/${productId}`, {
          method: 'PUT',
          body: JSON.stringify({
            qty: value - 1,
          }),
        })
      } else {
        // if qty would go to 0, remove the item
        await fetch(`/api/users/${userId}/cart/${productId}`, {
          method: 'DELETE',
        })
      }
      router.refresh()
    } finally {
      setIsUpdating(false)
    }
  }

  const onDeleteBtnClick = async function () {
    setIsUpdating(true)

    try {
      await fetch(`/api/users/${userId}/cart/${productId}`, {
        method: 'DELETE',
      })
      router.refresh()
    } finally {
      setIsUpdating(false)
    }
  }

  return(
    <div className='grid grid-cols-4'>
      <div>
        <button
          onClick={onMinusBtnClick}
          disabled={isUpdating}
          className="bg-gray-200 text-gray-700 px-3 py-1 rounded-md hover:bg-gray-300 disabled:opacity-50"
        >
          -
        </button>
      </div>
      <div className='text-black'>
        {value}
      </div>
      <div>
        <button onClick={onPlusBtnClick} className="bg-gray-200 text-gray-700 px-3 py-1 rounded-md hover:bg-gray-300 disabled:opacity-50" disabled={isUpdating}>
          +
        </button>
      </div>
        <div>
          <button 
          onClick={onDeleteBtnClick} 
          className='bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded' 
          disabled={isUpdating}
          aria-label="Remove item">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-3 md: h-8 md:w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
    </div>
  );
}