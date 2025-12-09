import { Types } from 'mongoose'
import { notFound } from 'next/navigation'
import Users from '@/models/User'
import { getUserOrders } from '@/lib/handlers'
import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import Link from 'next/link'
import { Order } from '@/models/Order'
export default async function Ticket() {
  const session = await getSession()
    if (!session) {
      redirect('/auth/signin')
    }
    //const cartItemsData = await getUserCart(session.userId)
    //if (!cartItemsData) {
    //  redirect('/auth/signin')
    //}
    const userOrders=await getUserOrders(session.userId)
    const user = await Users.findById(session.userId)
    
  return (
    
        <div>
      <div className="text-3xl text-center font-semibold">
        User profile
      </div> 
      <div className='flex flex-row gap-x-2'>
        <div>
          <img className='block h-8 w-auto'src='/img/user.png'alt='Shopping cart logo'/>
        </div>
        <div className='font-bold'>
          Full Name:
        </div>
        <div>
          {user!.name} {user!.surname}
        </div>
      </div>

      <div className='flex flex-row gap-x-2'>
        <div>
          <img className='block h-8 w-auto'src='/img/email.png'alt='House logo'/>
        </div>
        <div className='font-bold'>
          E-mail address:
        </div>
        <div>
          {user?.email}
        </div>
      </div>

      <div className='flex flex-row gap-x-2'>
        <div>
          <img className='block h-8 w-auto'src='/img/house.svg'alt='Credit Card logo'/>
        </div>
        <div className='font-bold'>
          Address:
        </div>
        <div>
          {user?.address} 
        </div>
      </div>

      <div className='flex flex-row gap-x-2'>
        <div>
          <img className='block h-8 w-auto'src='/img/cake.png'alt='Calendar logo'/>
        </div>
        <div className='font-bold'>
          Birthdate:
        </div>
        <div>
          {user?.birthdate.toLocaleDateString()}
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
                  <th className="py-2">ORDER ID</th>
                  <th className="py-2">SHIPMENT ADDRESS</th>
                  <th className="py-2">PAYMENT INFORMATION</th>
                </tr>
              </thead>
              <tbody>
                {userOrders!.orders.map((userOrder) => (
                  <tr key = {(userOrder as Order & Types.ObjectId)._id.toString()} className="border-b border-gray-100">
                    <td className="py-3">
                      <Link href={`/orders/${userOrder._id.toString()}`}>
                        {(userOrder as Order & Types.ObjectId)._id.toString()}
                      </Link>  
                    </td>
                    <td className="py-3">{(userOrder as Order & Types.ObjectId).address}</td>
                    <td className="py-3">
                      <div>
                        <div>
                          {(userOrder as Order & Types.ObjectId).cardHolder}
                        </div>
                        <div className="text-gray-400">
                          {(userOrder as Order & Types.ObjectId).cardNumber}
                        </div>
                      </div>
                      </td>
                  </tr>
                  
          ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}