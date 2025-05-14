'use client'

// React Imports
import { useState, useEffect } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'
import CircularProgress from '@mui/material/CircularProgress'
import Skeleton from '@mui/material/Skeleton'

// Next Auth Imports
import { useSession } from 'next-auth/react'

import AccountDelete from './AccountDelete'

type Data = {
  email: string
  name: string
  role: string
}

// Vars
const initialData: Data = {
  email: 'john.doe@example.com',
  name: 'John Doe',
  role: 'customer'
}

const AccountDetails = () => {
  // next-auth 세션에서 사용자 정보 가져오기
  const { data: session } = useSession()

  // States
  const [formData, setFormData] = useState<Data>(initialData)
  const [originalData, setOriginalData] = useState<Data | null>(null)
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [newPasswordConfirm, setNewPasswordConfirm] = useState('')
  const [pwMsg, setPwMsg] = useState('')
  const [pwSuccess, setPwSuccess] = useState(false)
  const [saveMsg, setSaveMsg] = useState('')
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [open, setOpen] = useState(false)
  const [openPw, setOpenPw] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isPwChanging, setIsPwChanging] = useState(false)
  const [loading, setLoading] = useState(true)

  // 세션 정보로 formData 초기화
  useEffect(() => {
    const fetchUser = async () => {
      if (session?.user?.email) {
        setLoading(true)
        const res = await fetch(`/users/api?email=${encodeURIComponent(session.user.email)}`)

        if (res.ok) {
          const user = await res.json()

          const userData = {
            email: user.email,
            name: user.name,
            role: user.role
          }

          setFormData(userData)
          setOriginalData(userData)
        }

        setLoading(false)
      }
    }

    fetchUser()
  }, [session])

  const handleFormChange = (field: keyof Data, value: Data[keyof Data]) => {
    setFormData({ ...formData, [field]: value })
  }

  // 저장 핸들러(이름 변경)
  const handleSave = async () => {
    setIsSaving(true)
    setSaveMsg('')
    setSaveSuccess(false)

    const res = await fetch('/users/api', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: formData.email,
        name: formData.name
      })
    })

    const result = await res.json()

    if (result.ok) {
      setSaveSuccess(true)
      setSaveMsg('저장되었습니다.')
      setOpen(true)

      // 이름 변경 후 최신 정보 fetch
      const refetch = await fetch(`/users/api?email=${encodeURIComponent(formData.email)}`)

      if (refetch.ok) {
        const user = await refetch.json()

        setFormData({
          email: user.email,
          name: user.name,
          role: user.role
        })
      }
    } else {
      setSaveMsg(result.message || '저장에 실패했습니다.')
      setOpen(true)
    }

    setIsSaving(false)
  }

  // 비밀번호 변경 핸들러
  const handleChangePassword = async () => {
    setIsPwChanging(true)
    setPwMsg('')
    setPwSuccess(false)

    if (!oldPassword || !newPassword || !newPasswordConfirm) {
      setPwMsg('모든 항목을 입력해 주세요.')
      setOpenPw(true)
      setIsPwChanging(false)

      return
    }

    if (newPassword !== newPasswordConfirm) {
      setPwMsg('새 비밀번호가 일치하지 않습니다.')
      setOpenPw(true)
      setIsPwChanging(false)

      return
    }

    if (newPassword.length < 8) {
      setPwMsg('비밀번호는 8자 이상이어야 합니다.')
      setOpenPw(true)
      setIsPwChanging(false)

      return
    }

    // 실제 API 연동
    const res = await fetch('/users/api', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: session?.user?.email,
        oldPassword,
        newPassword
      })
    })

    const result = await res.json()

    if (result.ok) {
      setPwSuccess(true)
      setPwMsg('비밀번호가 성공적으로 변경되었습니다.')
      setOldPassword('')
      setNewPassword('')
      setNewPasswordConfirm('')
      setOpenPw(true)
    } else {
      setPwMsg(result.message || '비밀번호 변경에 실패했습니다.')
      setOpenPw(true)
    }

    setIsPwChanging(false)
  }

  return (
    <>
      <Card>
        <CardContent>
          <form
            onSubmit={e => {
              e.preventDefault()
              handleSave()
            }}
          >
            <Grid container spacing={5}>
              <Grid item xs={12} sm={6}>
                {loading ? (
                  <Skeleton variant='rounded' height={56} />
                ) : (
                  <TextField
                    fullWidth
                    label='Email'
                    value={formData.email}
                    placeholder='john.doe@gmail.com'
                    onChange={e => handleFormChange('email', e.target.value)}
                    disabled
                  />
                )}
              </Grid>
              <Grid item xs={12} sm={6}>
                {loading ? (
                  <Skeleton variant='rounded' height={56} />
                ) : (
                  <TextField
                    fullWidth
                    label='이름'
                    value={formData.name}
                    placeholder='이름'
                    onChange={e => handleFormChange('name', e.target.value)}
                  />
                )}
              </Grid>
              <Grid item xs={12} sm={6}>
                {loading ? (
                  <Skeleton variant='rounded' height={56} />
                ) : (
                  <TextField fullWidth label='권한' value={formData.role} placeholder='권한' disabled />
                )}
              </Grid>
              <Grid item xs={12} className='flex gap-4 flex-wrap'>
                <Button variant='contained' type='submit' disabled={isSaving || loading}>
                  {isSaving ? <CircularProgress size={20} color='inherit' /> : 'Save Changes'}
                </Button>
                <Button
                  variant='outlined'
                  type='reset'
                  color='secondary'
                  onClick={() => originalData && setFormData(originalData)}
                  disabled={loading}
                >
                  Reset
                </Button>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
      <Grid container spacing={4} sx={{ marginTop: 2 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant='h6' sx={{ marginBottom: 2 }}>
                비밀번호 변경
              </Typography>
              <Grid container spacing={3} alignItems='center'>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label='현재 비밀번호'
                    type='password'
                    value={oldPassword}
                    onChange={e => setOldPassword(e.target.value)}
                    autoComplete='current-password'
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label='새 비밀번호'
                    type='password'
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    autoComplete='new-password'
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label='새 비밀번호 확인'
                    type='password'
                    value={newPasswordConfirm}
                    onChange={e => setNewPasswordConfirm(e.target.value)}
                    autoComplete='new-password'
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button variant='outlined' color='primary' onClick={handleChangePassword} disabled={isPwChanging}>
                    {isPwChanging ? <CircularProgress size={20} color='inherit' /> : '비밀번호 변경'}
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <AccountDelete />
        </Grid>
      </Grid>
      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={() => setOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={() => setOpen(false)} severity={saveSuccess ? 'success' : 'error'} sx={{ width: '100%' }}>
          {saveMsg}
        </Alert>
      </Snackbar>
      <Snackbar
        open={openPw}
        autoHideDuration={3000}
        onClose={() => setOpenPw(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={() => setOpenPw(false)} severity={pwSuccess ? 'success' : 'error'} sx={{ width: '100%' }}>
          {pwMsg}
        </Alert>
      </Snackbar>
    </>
  )
}

export default AccountDetails
