// Third-party Imports
import 'react-perfect-scrollbar/dist/css/styles.css'

// Type Imports
import type { ChildrenType } from '@core/types'

// Style Imports
import '@/app/globals.css'

// Generated Icon CSS Imports
import '@assets/iconify-icons/generated-icons.css'
import NextAuthProvider from '@/libs/next-auth'

export const metadata = {
  title: 'Demo: admin',
  description: 'admin'
}

const RootLayout = ({ children }: ChildrenType) => {
  // Vars
  const direction = 'ltr'

  return (
    <html id='__next' dir={direction}>
      <NextAuthProvider>
        <body className='flex is-full min-bs-full flex-auto flex-col'>{children}</body>
      </NextAuthProvider>
    </html>
  )
}

export default RootLayout
