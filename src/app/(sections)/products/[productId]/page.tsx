import { Types } from 'mongoose'
import { notFound } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { getUserCart,getProduct } from '@/lib/handlers'
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
  if (!session) {
      return show_without_plus_or_minus({ params },product)
  }
  const cartItemsData = await getUserCart(session?.userId)
  return (
    <div>
      <div className='text-3xl font-bold'>
        {product.name}
      </div>
    
      <div className='flex-col grid grid-cols-1 md:grid-cols-2 gap-4 '>
        <div>
        <img src={product.img} alt={product.name} className='max-h-80 max-w-80 object-cover group-hover:opacity-75 h-screen m-auto'/>
        <h2 className='text-1xl font-bold text-black text-center'>
          {product.description && <p>{product.description}</p>}
          {product.price + ' $'}
        </h2>
          <div className='grid grid-cols-4'>
            <div>
              <button className="bg-gray-200 text-gray-700 px-3 py-1 rounded-md hover:bg-gray-300">
                -
              </button>
            </div>
            <div>
              {cartItemsData?.cartItems.find(cartItem=>cartItem.product.id==product._id)?.qty}
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
        <div>
          <div className='text-xl font-bold'>
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
function show_without_plus_or_minus({
  params,
}: {
  params: { productId: string }
},product){
  return(
<div>
      <div className='text-3xl font-bold'>
        {product.name}
      </div>
    
      <div className='flex-col grid grid-cols-1 md:grid-cols-2 gap-4 '>
        <div>
        <img src={product.img} alt={product.name} className='max-h-80 max-w-80 object-cover group-hover:opacity-75 h-screen m-auto'/>
        <h2 className='text-1xl font-bold text-black text-center'>
          {product.description && <p>{product.description}</p>}
          {product.price + ' $'}
        </h2>
        </div>
        <div>
          <div className='text-xl font-bold'>
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