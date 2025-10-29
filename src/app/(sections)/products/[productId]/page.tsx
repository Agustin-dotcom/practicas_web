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
    <div className='flex flex-col'>
      <h3 className='pb-4 text-3xl font-bold text-gray-900 sm:pb-6 lg:pb-8'>
        {product.name}
      </h3>
        <img
          src={product.img}
          alt={product.name}
          className='max-h-40 max-w-40 object-cover object-center group-hover:opacity-75'
        />
      {product.description && <p>{product.description}</p>}
      {product.price + ' $'}
    </div>
  )
}