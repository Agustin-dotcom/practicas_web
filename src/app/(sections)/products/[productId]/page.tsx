import { Types } from 'mongoose'
import { notFound } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { getUserCart,getProduct } from '@/lib/handlers'
import AddSubtractQuantityOrDeleteItemButtons from '@/components/CartItemCounter'
import ProductComponent from '@/components/ProductComponent'
import {Product} from '@/models/Product'
export default async function Product_({
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
  if(!session)
  {
    return(<ProductComponent session={session} product={product} qty={0} />)
  }
  const cartItemsData = await getUserCart(session?.userId)
  let qty = 0
  const specificProductWeWant = cartItemsData?.cartItems.find(cartItem=>(cartItem.product as Product & Types.ObjectId)._id.toString()==product._id.toString())
  
  if(specificProductWeWant)
  {
    qty = specificProductWeWant.qty
  }
  return (<ProductComponent session={session.userId} product={product} qty={qty} />)
}