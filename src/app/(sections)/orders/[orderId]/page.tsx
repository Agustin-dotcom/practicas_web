import { Types } from 'mongoose'
import { notFound } from 'next/navigation'
import { getUserOrder } from '@/lib/handlers'
import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import Link from 'next/link'
export default async function Ticket({
  params,
}: {
  params: { orderId: string }
}) {
    if (!Types.ObjectId.isValid(params.orderId)) {
      notFound()
    }
  const session = await getSession()
    if (!session) {
      redirect('/auth/signin')
    }
    const userOrder = await getUserOrder(session.userId,params.orderId)
    if (userOrder === null) {
      notFound()
    }
    //const cartItemsData = await getUserCart(session.userId)
    //if (!cartItemsData) {
    //  redirect('/auth/signin')
    //}
  const totalPrice:number[] = [userOrder.orderItems.map((orderItem)=>(orderItem.product.price*orderItem.qty))];
  let suma = 0;
  for (let i = 0;i<totalPrice[0].length;i++){
    suma += totalPrice[0][i]
  }
  return (
    
        <div>
      <div className="text-3xl text-center font-semibold">
        Order details
      </div> 
      <div className='flex flex-row gap-x-2'>
        <div>
          <img className='block h-8 w-auto'src='/img/shopping_cart.svg'alt='Shopping cart logo'/>
        </div>
        <div className='font-bold'>
          Order ID:
        </div>
        <div>
          {userOrder._id}
        </div>
      </div>

      <div className='flex flex-row gap-x-2'>
        <div>
          <img className='block h-8 w-auto'src='/img/house.svg'alt='House logo'/>
        </div>
        <div className='font-bold'>
          Shipping address:
        </div>
        <div>
          {userOrder.address}
        </div>
      </div>

      <div className='flex flex-row gap-x-2'>
        <div>
          <img className='block h-8 w-auto'src='/img/credit_card.svg'alt='Credit Card logo'/>
        </div>
        <div className='font-bold'>
          Payment information:
        </div>
        <div>
          {userOrder.cardNumber} ({userOrder.cardHolder})
        </div>
      </div>

      <div className='flex flex-row gap-x-2'>
        <div>
          <img className='block h-8 w-auto'src='/img/calendar.svg'alt='Calendar logo'/>
        </div>
        <div className='font-bold'>
          Date of purchase:
        </div>
        <div>
          {userOrder.date.toLocaleDateString()}
        </div>
      </div>
      {/* Checkout Section */}
      <div className="flex-grow flex justify-center items-start py-10 px-4">
        <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg p-6 md:p-10">
          

          {/* Order Summary */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="py-2">PRODUCT NAME</th>
                  <th className="py-2">QUANTITY</th>
                  <th className="py-2">PRICE</th>
                  <th className="py-2">TOTAL</th>
                </tr>
              </thead>
              <tbody>
                {userOrder.orderItems.map((orderItem) => (
                  <tr key = {orderItem.product._id.toString()} className="border-b border-gray-100">
                    <td className="py-3">
                      <Link href={`/products/${orderItem.product._id.toString()}`}>
                        {orderItem.product.name}
                      </Link>  
                    </td>
                    <td className="py-3">{orderItem.qty}</td>
                    <td className="py-3">{orderItem.product.price} $</td>
                    <td className="py-3">{orderItem.product.price*orderItem.qty} $</td>
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
        </div>
      </div>
    </div>
  );
}