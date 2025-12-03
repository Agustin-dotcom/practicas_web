import { redirect } from 'next/navigation'
import { getUserCart,updateCartItem } from '@/lib/handlers'
import Link from 'next/link'
import { getSession } from '@/lib/auth'
import CartCheckoutButton from '@/components/CartCheckoutButton'
import AddSubtractQuantityOrDeleteItemButtons from '@/components/AddSubtractQuantityOrDeleteItemButtons'
import PurchaseCheckoutButton from '@/components/PurchaseCheckoutButton'

export default async function Cart() {
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
                    <AddSubtractQuantityOrDeleteItemButtons userId={session.userId} productId={cartItem.product._id.toString()} value={cartItem.qty}/>
                    </div>
                  </div>
              </div>
          ))}
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