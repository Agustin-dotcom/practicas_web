import { Types } from 'mongoose'
import { NextRequest, NextResponse } from 'next/server'
import { ErrorResponse,getCartItems,GetCartItemsResponse,getUser} from '@/lib/handlers'

export async function GET(
  request: NextRequest,
  {
    params,
  }: {
    params: { userId: string }
  }
): Promise<NextResponse<GetCartItemsResponse> | NextResponse<ErrorResponse>> {
  console.log(params.userId);
  if (!Types.ObjectId.isValid(params.userId)) {
    return NextResponse.json(
      {
        error: 'WRONG_PARAMS',
        message: 'Invalid user ID.',
      },
      { status: 400 }
    )
  }

  const user = await getUser(params.userId)

  if (user === null) {
    return NextResponse.json(
      {
        error: 'NOT_FOUND',
        message: 'User not found.',
      },
      { status: 404 }
    )
  }
  const cartItems = await getCartItems(params.userId)
  return NextResponse.json(cartItems)
}