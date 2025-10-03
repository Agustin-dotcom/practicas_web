import { Types } from 'mongoose'
import { NextRequest, NextResponse } from 'next/server'
import { ErrorResponse,getCartItems,GetCartItemsResponse,getProducts,getUser, isProductInCart, productExists, putNumberOfItems} from '@/lib/handlers'

export async function PUT(
  request: NextRequest,
  {
    params,
  }: {
    params: { 
      userId: string ,
      productId:string
    }
  }
): Promise<NextResponse<GetCartItemsResponse> | NextResponse<ErrorResponse>> {
  const body = await request.json();
  console.log('user.Id -->'+params.userId); //cambio
  console.log('product.Id -->'+params.productId);
  if (!Types.ObjectId.isValid(params.userId) ||
  !Types.ObjectId.isValid(params.productId) ||
  !(body.qty >0)) {
    return NextResponse.json(
      {
        error: 'WRONG_PARAMS',
        message: 'Invalid user ID, invalid product ID or number of items not greater than 0.',
      },
      { status: 400 }
    )
  }

  const user = await getUser(params.userId)
  const cond = await productExists(params.productId)
  if (user === null || cond) {
    return NextResponse.json(
      {
        error: 'NOT_FOUND',
        message: 'User not found or product not found',
      },
      { status: 404 }
    )
  }

  const updatedCart = await putNumberOfItems(params.userId,params.productId,body.qty)
  return NextResponse.json(updatedCart)
}