'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import PurchaseCheckoutButton from '@/components/PurchaseCheckoutButton'

interface FormValues {
  shippingAddress: string
  cardHolder: string
  cardNumber: string
}

interface CheckOutFormProps {
  userId: string
}

export default function CheckOutForm({
  userId
}: CheckOutFormProps) {
  const router = useRouter()
  const [error, setError] = useState<string>('')
  const [formValues, setFormValues] = useState<FormValues>({
    shippingAddress: '',
    cardHolder: '',
    cardNumber: ''
  })

  const handleSubmit = async function (
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault()
    if (!event.currentTarget.checkValidity()) {
      return false
    }

    const res = await fetch(`/api/users/${userId}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        address: formValues.shippingAddress,
        cardHolder: formValues.cardHolder,
        cardNumber: formValues.cardNumber,
      }),
    })
    const data = await res.json()
    
    if (res.ok) {
      setError('')
      // Redirige usando el orderId de la respuesta
      router.push(`/orders/${data._id}`)
      router.refresh()
    } else {
      setError(
        data.error ||
          'An error occurred while processing your request. Please try again later.'
      )
    }
  }

  return (
    <div className="mt-8">
      <form className="group grid grid-cols-1 gap-4 space-y-6" onSubmit={handleSubmit} noValidate>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Shipping Address
          </label>
          <input
            type="text"
            name="shippingAddress"
            placeholder="Calle Ramon Cajal 2"
            required
            className="peer mt-1 w-full rounded-lg border border-gray-300 p-2 focus:ring-2 focus:ring-indigo-500 invalid:[&:not(:placeholder-shown):not(:focus)]:ring-red-500"
            value={formValues.shippingAddress}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setFormValues((prevFormValues) => ({
                ...prevFormValues,
                shippingAddress: e.target.value,
              }))
            }
          />
          <p className='mt-2 hidden text-sm text-red-500 peer-[&:not(:placeholder-shown):not(:focus):invalid]:block'>
            Please provide a valid shipping address.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Card Holder
            </label>
            <input
              type="text"
              name="cardHolder"
              placeholder="John Doe"
              required
              pattern='.* .*'
              className="peer mt-1 w-full rounded-lg border border-gray-300 p-2 focus:ring-2 focus:ring-indigo-500 invalid:[&:not(:placeholder-shown):not(:focus)]:ring-red-500"
              value={formValues.cardHolder}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFormValues((prevFormValues) => ({
                  ...prevFormValues,
                  cardHolder: e.target.value,
                }))
              }
            />
            <p className='mt-2 hidden text-sm text-red-500 peer-[&:not(:placeholder-shown):not(:focus):invalid]:block'>
              Please provide a valid card holder name.
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Card Number
            </label>
            <input
              type="text"
              name="cardNumber"
              placeholder="1234"
              pattern='^[0-9]{4}$'
              required
              className="peer mt-1 w-full rounded-lg border border-gray-300 p-2 focus:ring-2 focus:ring-indigo-500 invalid:[&:not(:placeholder-shown):not(:focus)]:ring-red-500"
              value={formValues.cardNumber}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFormValues((prevFormValues) => ({
                  ...prevFormValues,
                  cardNumber: e.target.value,
                }))
              }
            />
            <p className='mt-2 hidden text-sm text-red-500 peer-[&:not(:placeholder-shown):not(:focus):invalid]:block'>
              Please provide a valid card number.
            </p>
          </div>
        </div>

        <div className={error ? '' : 'hidden'}>
          <p className='mt-2 rounded-md border-0 bg-red-500 bg-opacity-30 px-3 py-1.5 text-sm text-gray-900 ring-1 ring-inset ring-red-500'>
            {error}
          </p>
        </div>

        <div>
          <button
            type='submit'
            className='flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 group-invalid:pointer-events-none group-invalid:opacity-30'
          >
            Purchase
          </button>
        </div>
      </form>
    </div>
  )
}