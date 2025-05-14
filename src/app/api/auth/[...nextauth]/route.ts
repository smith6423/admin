import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { PrismaClient } from '@prisma/client'
import { compare } from 'bcryptjs'
import type { AuthOptions } from 'next-auth'

const prisma = new PrismaClient()

const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null
        const user = await prisma.user.findUnique({ where: { email: credentials.email } })

        if (!user) return null

        // 비밀번호는 해시되어 있다고 가정 (회원가입시 해시 필요)
        if (!user.hashedPassword) return null
        const isValid = await compare(credentials.password, user.hashedPassword)

        if (!isValid) return null

        return { id: user.id + '', email: user.email, name: user.name }
      }
    })
  ],
  session: { strategy: 'jwt' as const },
  callbacks: {
    async session({ session, token }: { session: any; token: any }) {
      if (token?.sub) (session.user as any).id = token.sub

      return session
    }
  },
  pages: {
    signIn: '/login',
    signOut: '/logout',
    error: '/login' // 에러 발생시 로그인 페이지로
  },
  secret: process.env.NEXTAUTH_SECRET || 'devsecret'
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST, authOptions }
