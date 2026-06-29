import { deleteSession } from '@/lib/auth'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function POST(request: NextRequest): Promise<NextResponse<null>> {
  deleteSession()

  return new NextResponse(null, { status: 204 })
}