const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  const password = await bcrypt.hash('test123!', 10)

  await prisma.user.createMany({
    data: [
      {
        email: 'admin1@example.com',
        name: '관리자1',
        hashedPassword: password,
        role: 'admin'
      },
      {
        email: 'manager1@example.com',
        name: '매니저1',
        hashedPassword: password,
        role: 'guest'
      },
      {
        email: 'customer1@example.com',
        name: '고객1',
        hashedPassword: password,
        role: 'customer'
      },
      {
        email: 'customer2@example.com',
        name: '고객2',
        hashedPassword: password,
        role: 'customer'
      },
      {
        email: 'admin2@example.com',
        name: '관리자2',
        hashedPassword: password,
        role: 'admin'
      }
    ],
    skipDuplicates: true
  })
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
