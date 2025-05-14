import UsersTable from './UsersTable'

export default async function UsersPage() {
  // 서버 컴포넌트에서는 fetch에 절대경로 사용
  const res = await fetch('http://localhost:3000/users/api', { cache: 'no-store' })
  const users = await res.json()

  return <UsersTable users={users} />
}
