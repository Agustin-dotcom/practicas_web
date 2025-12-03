import { Product } from '@/models/Product'
import { Types } from 'mongoose'
import AddSubtractQuantityOrDeleteItemButtons from '@/components/AddSubtractQuantityOrDeleteItemButtons'

interface ProductTileProps {
  product: Product & { _id: Types.ObjectId },
  session:string | null,
  qty:number
}

export default function ProductTile({ product,session,qty }: ProductTileProps) {
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
            {(!session)?(<></>):(<AddSubtractQuantityOrDeleteItemButtons userId={session} productId={product._id.toString()} value={qty}/>)}
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