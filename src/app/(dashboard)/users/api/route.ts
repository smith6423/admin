import { NextResponse } from 'next/server'

import { getServerSession } from 'next-auth'

import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

import { authOptions } from '@/app/api/auth/[...nextauth]/route'

const prisma = new PrismaClient()

export async function GET(req: Request) {
  const session = await getServerSession(authOptions)
  const myEmail = session?.user?.email
  const { searchParams } = new URL(req.url)
  const email = searchParams.get('email')

  if (email) {
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        role: true
      }
    })

    if (!user) return NextResponse.json({ error: '사용자를 찾을 수 없습니다.' }, { status: 404 })

    return NextResponse.json(user)
  }

  const users = await prisma.user.findMany({
    where: myEmail ? { email: { not: myEmail } } : undefined,
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
      role: true
    },
    orderBy: { id: 'asc' }
  })

  // 날짜 포맷 변환 (YYYY-MM-DD)
  const usersData = users.map(u => ({
    ...u,
    createdAt: u.createdAt instanceof Date ? u.createdAt.toISOString().slice(0, 10) : u.createdAt
  }))

  return NextResponse.json(usersData)
}

export async function PATCH(req: Request) {
  const body = await req.json()
  const { id, role, resetPassword, email, oldPassword, newPassword, name } = body

  // 비밀번호 변경
  if (email && oldPassword && newPassword) {
    const user = await prisma.user.findUnique({ where: { email } })

    if (!user || !user.hashedPassword) {
      return NextResponse.json(
        { ok: false, message: '사용자를 찾을 수 없거나 비밀번호가 설정되어 있지 않습니다.' },
        { status: 400 }
      )
    }

    const isValid = await bcrypt.compare(oldPassword, user.hashedPassword)

    if (!isValid) {
      return NextResponse.json({ ok: false, message: '현재 비밀번호가 일치하지 않습니다.' }, { status: 400 })
    }

    const hashed = await bcrypt.hash(newPassword, 10)

    await prisma.user.update({ where: { email }, data: { hashedPassword: hashed } })

    return NextResponse.json({ ok: true, message: '비밀번호가 성공적으로 변경되었습니다.' })
  }

  // 이름 변경
  if (email && name) {
    await prisma.user.update({ where: { email }, data: { name } })

    return NextResponse.json({ ok: true, message: '이름이 저장되었습니다.' })
  }

  // 기존 로직 (id 기반)
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })

  if (role) {
    // 권한 변경
    await prisma.user.update({ where: { id }, data: { role } })

    return NextResponse.json({ ok: true, message: '권한이 변경되었습니다.' })
  }

  if (resetPassword) {
    // 패스워드 초기화
    const hashed = await bcrypt.hash('Coocon123!', 10)

    await prisma.user.update({ where: { id }, data: { hashedPassword: hashed } })

    return NextResponse.json({ ok: true, message: '비밀번호가 초기화되었습니다.' })
  }

  return NextResponse.json({ error: 'role, resetPassword 또는 비밀번호 변경 정보 필요' }, { status: 400 })
}

export async function DELETE(req: Request) {
  const body = await req.json()
  const { id } = body

  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })
  await prisma.user.delete({ where: { id } })

  return NextResponse.json({ ok: true, message: '사용자가 삭제되었습니다.' })
}
