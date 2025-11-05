import { Types } from 'mongoose'
import { notFound } from 'next/navigation'
import { getProduct } from '@/lib/handlers'

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

  return (
    <div className='flex-col grid grid-cols-2 gap-4 '>
      <div  className='' >
      <h3 className='text-3xl font-bold text-black text-center'>

        {product.name}
      </h3>
        <img
          src={product.img}
          alt={product.name}
          className='max-h-80 max-w-80 object-cover group-hover:opacity-75 h-screen m-auto'
          
        />
        <h2 className='text-1xl font-bold text-black text-center' >
      {product.description && <p>{product.description}</p>}
      {product.price + ' $'}
      </h2>
      </div>
      <div className='flex none items-center ' 
        
      >
      <h2 className= 'text-1xl font-bold text-black text-left '>
        {product.cuerpo}
      </h2>
      </div>
    </div>
  )
}