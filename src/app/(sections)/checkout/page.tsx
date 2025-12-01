import { Types } from 'mongoose'
import { notFound } from 'next/navigation'
import { getProduct } from '@/lib/handlers'
import { redirect } from 'next/navigation'
import { getUserCart,updateCartItem } from '@/lib/handlers'
import Link from 'next/link'
import { getSession } from '@/lib/auth'
import CartCheckoutButton from '@/components/CartCheckoutButton'
import NavbarButton from '@/components/NavbarButton'
import PurchaseCheckoutButton from '@/components/PurchaseCheckoutButton'
export default async function Checkout() {
  const session = await getSession()
    if (!session) {
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
    <div>
      <div className="text-4xl font-semibold mb-6 text-center">
        Checkout
      </div>
    
    {cartItemsData.cartItems.length === 0 ? (
        <div className='text-center'>
          <span className='text-sm text-gray-400'>The cart is empty</span>
        </div>
      ) : (
    <>
    
    <div className="flex-shrink">
      {/* Checkout Section */}
      <main className="flex-grow flex justify-center items-start py-10 px-4">
        <div className="w-full max-w-3xl rounded-2xl shadow-lg p-6 md:p-10">
          

          {/* Order Summary */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="py-2">Product</th>
                  <th className="py-2">Quantity</th>
                  <th className="py-2">Price</th>
                  <th className="py-2">Total</th>
                </tr>
              </thead>
              <tbody>
                {cartItemsData.cartItems.map((cartItem) => (
                  <tr key = {cartItem.product._id.toString()} className="border-b border-gray-100">
                    <td className="py-3">
                      <Link href={`/products/${cartItem.product._id.toString()}`}>
                        {cartItem.product.name}
                      </Link>  
                    </td>
                    <td className="py-3">{cartItem.qty}</td>
                    <td className="py-3">{cartItem.product.price} $</td>
                    <td className="py-3">{cartItem.product.price*cartItem.qty} $</td>
                  </tr>
                  
          ))}
                <tr>
                    <td className="py-3">Total:</td>
                    <td className="py-3"></td>
                    <td className="py-3"></td>
                    <td className="py-3">{suma} $</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Payment Form */}
          <div className="mt-8">
            <form className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Shipping Address
                </label>
                <input
                  type="text"
                  placeholder="Calle Ramon Cajal 2"
                  className="mt-1 w-full rounded-lg border border-gray-300 p-2 focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Card Holder
                  </label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    className="mt-1 w-full rounded-lg border border-gray-300 p-2 focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Card Number
                  </label>
                  <input
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    className="mt-1 w-full rounded-lg border border-gray-300 p-2 focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Purchase Button */}
              <PurchaseCheckoutButton href='' buttonText='Purchase'>
                <></>
          </PurchaseCheckoutButton>
            </form>
            
          </div>
          
        </div>
        
      </main>
      
    </div>

    </>)}
    </div>
  );
}