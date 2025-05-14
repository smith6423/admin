'use client'

import React, { useMemo, useState } from 'react'

import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getPaginationRowModel,
  type ColumnDef,
  type Row
} from '@tanstack/react-table'

import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import Button from '@mui/material/Button'

export default function UsersTable({ users }: { users: any[] }) {
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 })
  const [openDialog, setOpenDialog] = useState(false)
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null)
  const [confirmChecked, setConfirmChecked] = useState(false)

  // 핸들러 함수
  const handleRoleChange = async (id: number, newRole: string) => {
    const res = await fetch('/users/api', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, role: newRole })
    })

    const result = await res.json()

    alert(result.message)
    location.reload()
  }

  const handleResetPassword = async (id: number) => {
    if (!confirm('비밀번호를 Coocon123! 으로 초기화하시겠습니까?')) return

    const res = await fetch('/users/api', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, resetPassword: true })
    })

    const result = await res.json()

    alert(result.message)
    location.reload()
  }

  const handleOpenDialog = (id: number) => {
    setSelectedUserId(id)
    setConfirmChecked(false)
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
    setSelectedUserId(null)
    setConfirmChecked(false)
  }

  const handleConfirmDelete = async () => {
    if (!selectedUserId) return

    const res = await fetch('/users/api', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: selectedUserId })
    })

    const result = await res.json()

    alert(result.message)
    setOpenDialog(false)
    setSelectedUserId(null)
    setConfirmChecked(false)
    location.reload()
  }

  const columns = useMemo<ColumnDef<any, any>[]>(
    () => [
      { accessorKey: 'id', header: 'ID', cell: (info: any) => info.getValue() },
      { accessorKey: 'name', header: 'Name', cell: (info: any) => info.getValue() },
      { accessorKey: 'email', header: 'Email', cell: (info: any) => info.getValue() },
      { accessorKey: 'createdAt', header: 'Created At', cell: (info: any) => info.getValue() },
      {
        accessorKey: 'role',
        header: 'Role',
        cell: ({ row }: { row: Row<any> }) => (
          <select
            value={row.original.role}
            onChange={e => handleRoleChange(row.original.id, e.target.value)}
            style={{ borderRadius: '6px', padding: '4px 8px' }}
          >
            <option value='admin'>admin</option>
            <option value='customer'>customer</option>
            <option value='guest'>guest</option>
          </select>
        )
      },
      {
        id: 'actions',
        header: '관리',
        cell: ({ row }: { row: Row<any> }) => (
          <>
            <button onClick={() => handleOpenDialog(row.original.id)} style={btnStyle2}>
              탈퇴
            </button>
            <button onClick={() => handleResetPassword(row.original.id)} style={btnStyle2}>
              패스워드 초기화
            </button>
          </>
        )
      }
    ],
    []
  )

  const table = useReactTable({
    data: users,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: { pagination },
    onPaginationChange: setPagination
  })

  return (
    <div
      style={{
        backdropFilter: 'blur(18px)',
        background: 'rgba(255,255,255,0.22)',
        borderRadius: '24px',
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.25)',
        border: '1.5px solid rgba(255,255,255,0.25)',
        padding: '32px',
        marginTop: '32px',
        overflowX: 'auto',
        maxWidth: '100%',
        transition: 'box-shadow 0.2s'
      }}
    >
      <table
        style={{
          width: '100%',
          borderCollapse: 'separate',
          borderSpacing: 0,
          color: '#1a237e',
          fontSize: 16,
          fontWeight: 400
        }}
      >
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id} style={{ background: 'rgba(255,255,255,0.35)', backdropFilter: 'blur(12px)' }}>
              {headerGroup.headers.map(header => (
                <th
                  key={header.id}
                  style={{
                    padding: '16px 12px',
                    fontWeight: 700,
                    fontSize: 17,
                    borderBottom: '2px solid rgba(180,200,255,0.25)',
                    textAlign: 'center',
                    letterSpacing: 0.5,
                    background: 'rgba(255,255,255,0.25)',
                    backdropFilter: 'blur(8px)'
                  }}
                >
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map(row => (
            <tr
              key={row.id}
              style={{
                textAlign: 'center',
                background: 'rgba(255,255,255,0.18)',
                transition: 'background 0.2s',
                borderRadius: 12,
                boxShadow: '0 1px 8px 0 rgba(31, 38, 135, 0.07)',
                cursor: 'pointer'
              }}
              onMouseOver={e => (e.currentTarget.style.background = 'rgba(180, 220, 255, 0.22)')}
              onMouseOut={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.18)')}
            >
              {row.getVisibleCells().map(cell => (
                <td
                  key={cell.id}
                  style={{
                    padding: '14px 12px',
                    borderBottom: '1px solid rgba(180,200,255,0.13)',
                    fontSize: 15,
                    fontWeight: 400,
                    textAlign: 'center'
                  }}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {/* 페이지네이션 */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: 24 }}>
        <button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()} style={btnStyle2}>
          이전
        </button>
        <span style={{ margin: '0 16px', fontWeight: 500, color: '#1a237e' }}>
          {pagination.pageIndex + 1} / {table.getPageCount()}
        </span>
        <button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()} style={btnStyle2}>
          다음
        </button>
        <select
          value={pagination.pageSize}
          onChange={e => setPagination(prev => ({ ...prev, pageSize: Number(e.target.value) }))}
          style={{
            marginLeft: 20,
            borderRadius: 8,
            padding: '6px 12px',
            background: 'rgba(255,255,255,0.45)',
            border: '1px solid #b3cfff',
            color: '#1a237e',
            fontWeight: 500
          }}
        >
          {[5, 10, 20, 50].map(size => (
            <option key={size} value={size}>
              {size}개씩 보기
            </option>
          ))}
        </select>
      </div>
      {/* Dialog for 탈퇴 확인 */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>정말로 탈퇴하시겠습니까?</DialogTitle>
        <DialogContent>
          <FormControlLabel
            control={<Checkbox checked={confirmChecked} onChange={e => setConfirmChecked(e.target.checked)} />}
            label='탈퇴에 동의합니다.'
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>취소</Button>
          <Button onClick={handleConfirmDelete} color='error' disabled={!confirmChecked}>
            탈퇴
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

const btnStyle2: React.CSSProperties = {
  margin: '0 6px',
  padding: '8px 18px',
  borderRadius: '10px',
  border: 'none',
  background: 'rgba(180, 220, 255, 0.35)',
  boxShadow: '0 2px 8px 0 rgba(31, 38, 135, 0.13)',
  cursor: 'pointer',
  color: '#1a237e',
  fontWeight: 600,
  fontSize: 15,
  transition: 'background 0.2s, color 0.2s',
  outline: 'none',
  minWidth: 60,
  borderBottom: '2px solid #b3cfff',
  letterSpacing: 0.2,
  opacity: 1
}
