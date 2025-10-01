import { Types } from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';
import { ErrorResponse, getUserOrder, GetOrderResponse } from '@/lib/handlers';

export async function GET(
  request: NextRequest,
  {
    params,
  }: {
    params: { userId: string; orderId: string };
  }
): Promise<NextResponse<GetOrderResponse> | NextResponse<ErrorResponse>> {
  if (
    !Types.ObjectId.isValid(params.userId) ||
    !Types.ObjectId.isValid(params.orderId)
  ) {
    return NextResponse.json(
      {
        error: 'WRONG_PARAMS',
        message: 'Invalid user ID or order ID.',
      },
      { status: 400 }
    );
  }

  const order = await getUserOrder(params.userId, params.orderId);

  if (order === null) {
    return NextResponse.json(
      {
        error: 'NOT_FOUND',
        message: 'User not found or order not found.',
      },
      { status: 404 }
    );
  }

  return NextResponse.json(order);
}