import { redirect } from 'next/navigation'
import { getUserCart,updateCartItem } from '@/lib/handlers'
import Link from 'next/link'
import { getSession } from '@/lib/auth'
import CartCheckoutButton from '@/components/CartCheckoutButton'

export default async function Cart() {
  const session = await getSession()
  if (!session) {
    console.log('hey')
    redirect('/auth/signin')
  }
  
  
  const cartItemsData = await getUserCart(session.userId)
  if (!cartItemsData) {
    redirect('/auth/signin')
  }
  const totalPrice:number[] = [cartItemsData.cartItems.map((cartItem)=>(cartItem.product.price*cartItem.qty))];
  let suma = 0;
  for (let i = 0;i<totalPrice[0].length;i++){
    suma += totalPrice[0][i]
  }

  return (
    <div className='flex flex-col'>
      <h3 className='pb-4 text-3xl font-bold text-gray-900 sm:pb-6 lg:pb-8'>
        My Shopping Cart
      </h3>
      {cartItemsData.cartItems.length === 0 ? (
        <div className='text-center'>
          <span className='text-sm text-gray-400'>The cart is empty</span>
        </div>
      ) : (
        <>
          {cartItemsData.cartItems.map((cartItem) => (
            
              <div key = {cartItem.product._id.toString()} className='grid grid-cols-1 md:grid-cols-2 justify-center items-center space-x-4 p-4 border rounded-lg shadow-sm'>
                <div>
                  <Link href={`/products/${cartItem.product._id.toString()}`}>
                    <img src={cartItem.product.img} alt={cartItem.product.name} class="flex flex-grow object-cover rounded"/>
                  </Link>    
                </div>
                <div className="flex flex-grow grid grid-cols-2 gap-x-6 items-center">
                    <div>
                      {cartItem.product.name}
                    </div>
                    <div>
                      <div className='font-bold text-lg md:text-2xl'>
                      {cartItem.qty * cartItem.product.price +' $'}
                    </div>
                    <div className='text-sm'>
                      {cartItem.product.description}
                    </div>
                    <div className='grid grid-cols-4'>
                      <div>
                        <button className="bg-gray-200 text-gray-700 px-3 py-1 rounded-md hover:bg-gray-300">
                          -
                        </button>
                      </div>
                      <div>
                        {cartItem.qty}
                      </div>
                      <div>
                        <button className="bg-gray-200 text-gray-700 px-3 py-1 rounded-md hover:bg-gray-300">
                          +
                        </button>
                      </div>
                      <div>
                        <button className='bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded'>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-3 md: h-8 md:w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    </div>
                  </div>
              </div>
          ))}
          <div className='flex justify-end text-end items-end space-x-4 p-4 border rounded-lg shadow-sm'>
                  Total: {suma + ' $'}
          </div>
          <div className="flex flex-col items-center">
              <CartCheckoutButton href='/checkout'>
                  <span className='sr-only'>Checkout</span>
                  <button 
                      className="flex justify-center bg-gray-200 text-gray-700 px-3 py-1 rounded-md hover:bg-gray-300">
                        Checkout
                    </button>
                  
          </CartCheckoutButton>
          </div>
        </>
      )}
    </div>
  )
}