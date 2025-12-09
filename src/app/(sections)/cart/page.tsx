import { redirect } from 'next/navigation'
import { getUserCart,updateCartItem } from '@/lib/handlers'
import Link from 'next/link'
import { getSession } from '@/lib/auth'
import CartCheckoutButton from '@/components/CartCheckoutButton'
import AddSubtractQuantityOrDeleteItemButtons from '@/components/CartItemCounter'
import PurchaseCheckoutButton from '@/components/PurchaseCheckoutButton'
import { Types } from 'mongoose';
import { Product } from '@/models/Product';

export default async function Cart() {
  const session = await getSession()
  if (!session) {
    redirect('/auth/signin')
  }
  
  
  const cartItemsData = await getUserCart(session.userId)
  if (!cartItemsData) {
    redirect('/auth/signin')
  }
  const totalPrice:number[] = []
  const listOfProducts = []
  cartItemsData.cartItems.map((cartItem)=>{
    const product = cartItem.product as Types.ObjectId & Product
    totalPrice.push(product.price*cartItem.qty)
    listOfProducts.push(product)
  });
  let suma = 0;
  for (let i = 0;i<totalPrice.length;i++){
    suma += totalPrice[i]
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
          {cartItemsData.cartItems.map((cartItem) => 
              (<div key = {cartItem.product._id.toString()} className='grid grid-cols-1 md:grid-cols-2 justify-center items-center space-x-4 p-4 border rounded-lg shadow-sm'>
                <div>
                  <Link href={`/products/${cartItem.product._id.toString()}`}>
                    <img src={(cartItem.product as Product & Types.ObjectId).img} alt={(cartItem.product as Product & Types.ObjectId).name} className="flex flex-grow object-cover rounded"/>
                  </Link>    
                </div>
                <div className="flex flex-grow grid grid-cols-2 gap-x-6 items-center">
                    <div>
                      {(cartItem.product as Product & Types.ObjectId).name}
                    </div>
                    <div>
                      <div className='font-bold text-lg md:text-2xl'>
                      {cartItem.qty * (cartItem.product as Product & Types.ObjectId).price +' $'}
                    </div>
                    <div className='text-sm'>
                      {(cartItem.product as Product & Types.ObjectId).description}
                    </div>
                    <AddSubtractQuantityOrDeleteItemButtons userId={session.userId} productId={(cartItem.product as Product & Types.ObjectId)._id.toString()} value={cartItem.qty}/>
                    </div>
                  </div>
              </div>
              )
          )}
          <div className='flex justify-end text-end items-end space-x-4 p-4 border rounded-lg shadow-sm'>
                  Total: {suma + ' $'}
          </div>
            
        </>
      )}
      <PurchaseCheckoutButton href='/checkout' buttonText='Checkout'>
              <></>
            </PurchaseCheckoutButton>
    </div>
  )
}