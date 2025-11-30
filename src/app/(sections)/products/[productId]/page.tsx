import { Types } from 'mongoose'
import { notFound } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { getUserCart,getProduct } from '@/lib/handlers'
import AddSubtractQuantityOrDeleteItemButtons from '@/components/AddSubtractQuantityOrDeleteItemButtons'
export default async function Product({
  params,
}: {
  params: { productId: string }
}) {
  if (!Types.ObjectId.isValid(params.productId)) {
    notFound()
  }
  const product = await getProduct(params.productId)
  if (product === null) {
    notFound()
  }
  const session = await getSession()
  
  const cartItemsData = await getUserCart(session?.userId)
  let qty = 0
  const specificProductWeWant = cartItemsData?.cartItems.find(cartItem=>cartItem.product.id==product._id)
  if(specificProductWeWant)
  {
    qty = specificProductWeWant.qty
  }
  return (
    <div>
      <div className='text-3xl text-black font-bold'>
        {product.name}
      </div>
    
      <div className='flex-col grid grid-cols-1 md:grid-cols-2 gap-4 '>
        <div>
        <img src={product.img} alt={product.name} className='max-h-80 max-w-80 object-cover group-hover:opacity-75 h-screen m-auto'/>
        <h2 className='text-1xl font-bold text-black text-center'>
          {product.description && <p>{product.description}</p>}
          {product.price + ' $'}
        </h2>
        {(!session)?(<></>):(<AddSubtractQuantityOrDeleteItemButtons qty={qty}/>)}
        </div>
        <div>
          <div className='text-xl font-bold text-black text-center'>
            Product details
          </div>
          <h2 className= 'text-1xl  text-black text-center '>
            {product.cuerpo}
          </h2>
        </div>
      </div>
    </div>
  )
}